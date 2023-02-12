import ImageFile from "../../image.js";
import {$div, $elm, $input} from "../../util/dom.js";
import EventBus from "../../util/eventbus.js";
import {COMMAND, EVENT} from "../../enum.js";
import input from "../input.js";
import Input from "../input.js";
import ContextMenu from "./contextMenu.js";

let LayerPanel = function(){
    let me = {};
    let contentPanel;
    let opacityRange;
    let blendSelect;
    let editIndex;
    
    let blendModes=[
        "normal",
        "lighter",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "hue",
        "saturation",
        "color",
        "luminosity",

        /*"source-in",
    "source-out",
    "source-atop",
    "destination-over",
    "destination-in",
    "destination-out",
    "destination-atop",
    "lighter",
    "copy",
    "xor",
    "difference",
    "exclusion"*/
    
    ]

    me.generate = (parent)=>{
        let toolbar = $div("paneltools multirow","",parent);
        let rangeSelect = $div("rangeselect","",toolbar);
        $div("label","Opacity",rangeSelect);
        opacityRange = document.createElement("input");
        opacityRange.type = "range";
        opacityRange.max=100;
        opacityRange.min=0;
        opacityRange.value = 100;
        opacityRange.oninput = ()=>{
            ImageFile.setLayerOpacity(opacityRange.value);
        }
        rangeSelect.appendChild(opacityRange);

        let blendSelectElm = $div("blendselect","",toolbar);
        $div("label","Blend",blendSelectElm);
        blendSelect = $elm("select","",blendSelectElm);
        blendModes.forEach(mode=>{
            $elm("option",mode,blendSelect);
        });
        blendSelect.oninput = ()=>{
            ImageFile.setLayerBlendMode(blendSelect.value);
        }


        $div("button delete","",toolbar,()=>{
            EventBus.trigger(COMMAND.DELETELAYER);
        });
        $div("button add","",toolbar,()=>{
            EventBus.trigger(COMMAND.NEWLAYER);
        });

        contentPanel = $div("panelcontent","",parent);
    }

    me.list = ()=>{
        contentPanel.innerHTML = "";
        let activeIndex = ImageFile.getActiveLayerIndex() || 0;
        let imageFile = ImageFile.getCurrentFile();
        let frame = imageFile.frames[ImageFile.getActiveFrameIndex()];
        let max = frame.layers.length-1;
        for (let i = 0;i<=max;i++){
            let layer = frame.layers[i];
            let elm = $div("layer" + (activeIndex === i ? " active":"") + (layer.visible?"":" hidden"),layer.name,contentPanel,()=>{
                if (elm.classList.contains('hasinput')){
                    let input = elm.querySelector("input");
                    if (input) input.focus();
                    return;
                };
                if (activeIndex !== i) ImageFile.activateLayer(i);
            });
            elm.style.top = 46 + ((max-i)*23) + "px";
            elm.currentIndex = elm.targetIndex = i;
            elm.id = "layer" + i;

            elm.onDragStart = (e)=>{
                if (elm.classList.contains('hasinput')) return;
                // TODO probably more performant if we postpone this to when we actually drag
                console.error("drag start");
                let dupe = $div("dragelement box",elm.innerText);
                Input.setDragElement(dupe,e);
            }

            elm.onDrag = (x,y)=>{
                if (elm.classList.contains('hasinput')) return;
                let distance = Math.abs(y)

                if (distance>5){
                    // Meh... did we just did a rugpull regenerating the layer list? FIXME!
                    let currentTarget = contentPanel.querySelector("#layer" + elm.currentIndex);
                    currentTarget.classList.add("ghost");

                    let indexChange = Math.round(y/23);
                    let newIndex = elm.currentIndex - indexChange;
                    elm.targetIndex = newIndex;
                    if (newIndex<0) newIndex=0;
                    if (newIndex>=max) newIndex = max;
                    console.error(distance,elm.currentIndex , newIndex);


                    for (let i = 0;i<=max;i++){
                        let el = contentPanel.querySelector("#layer" + i);
                        if (el){
                            if (elm.currentIndex === i){
                                el.style.top = 46 + ((max-newIndex)*23) + "px";
                            }else{
                                let ci = 0;
                                if (newIndex<elm.currentIndex && i >= newIndex && i<=elm.currentIndex){
                                    ci=1;
                                }
                                if (newIndex>elm.currentIndex && i <= newIndex && i>=elm.currentIndex){
                                    ci=-1;
                                }
                                el.style.top = 46 + ((max-i-ci)*23) + "px";
                            }
                        }
                    }
                }
            }

            elm.onDragEnd = (e)=>{
                console.log("drop");
                Input.removeDragElement();
                let currentTarget = contentPanel.querySelector("#layer" + elm.currentIndex);
                currentTarget.classList.remove("ghost");
                if (elm.currentIndex !== elm.targetIndex){
                    ImageFile.moveLayer(elm.currentIndex,elm.targetIndex);
                }
            }

            elm.onDoubleClick = ()=>{
                renameLayer(i);
            }

            elm.onContextMenu = ()=>{
                let items = [];
                if (max>1) items.push ({label: "Remove Layer", command: COMMAND.DELETELAYER});
                items.push ({label: "Duplicate Layer", command: COMMAND.DUPLICATELAYER});
                items.push ({label: "Rename Layer", action: ()=>{
                    renameLayer(i);
                    }});

                if (layer.hasMask){
                    items.push({label: "Remove Layer Mask", command: COMMAND.DELETELAYERMASK});
                    items.push({label: "Apply Layer Mask", command: COMMAND.APPLYLAYERMASK});
                }else{
                    items.push({label: "Add Layer Mask", command: COMMAND.LAYERMASK});
                }

                if (i<max) items.push ({label: "Move Up", command: COMMAND.LAYERUP});
                if (i>0){
                    items.push ({label: "Move Down", command: COMMAND.LAYERDOWN});
                    items.push ({label: "Merge Down", command: COMMAND.MERGEDOWN});
                }


                ContextMenu.show(items);
            }

            if (elm.currentIndex === editIndex){
                let input = $input("text",layer.name);
                elm.appendChild(input);
            }

            $div("eye","",elm,()=>{
                ImageFile.toggleLayer(i);
            })

            if (layer.hasMask){
                $div("mask" + (layer.isMaskActive()?" active":""),"",elm,()=>{
                    layer.toggleMask();
                    EventBus.trigger(EVENT.toolChanged);
                    EventBus.trigger(EVENT.layersChanged);
                })
            }

            if (activeIndex === i){
                opacityRange.value = layer.opacity;
                console.error(layer.blendMode,blendSelect);

                blendSelect.value = layer.blendMode;
            }
        }
    }


    function renameLayer(index){
        let elm=contentPanel.querySelector("#layer" + index);
        let layer = ImageFile.getLayer(index);
        if (elm){
            let input = $input("text",layer.name);
            input.onkeydown = function(e){
                e.stopPropagation();
                if (e.code === "Enter"){
                    layer.name = input.value;
                    me.list();
                }
                if (e.code === "Escape"){
                    me.list();
                }
            }
            elm.appendChild(input);
            elm.classList.add('hasinput');
            input.focus();

            // needed for rename from context menu
            setTimeout(()=>{
                input.focus();
            },50);
        }

    }


    EventBus.on(EVENT.layersChanged,me.list);


    return me;
}();

export default LayerPanel;