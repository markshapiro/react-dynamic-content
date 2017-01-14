import _ from 'lodash';

function getWidthAndSpacing(elm){
    var compStyle = window.getComputedStyle(elm, null);
    var result={
        width:Number(compStyle.getPropertyValue('width').replace("px","")),
        height:Number(compStyle.getPropertyValue('height').replace("px","")),
        margin:{}
    };
    _.each(['left','right','top','bottom'], dir=>{
        result[dir] = Number(compStyle.getPropertyValue('padding-'+dir).replace("px",""))
                    + Number(compStyle.getPropertyValue('border-'+dir+'-width').replace("px",""));
        result.margin[dir] = Number(compStyle.getPropertyValue('margin-'+dir).replace("px",""))
    });
    result.boxSizing = compStyle.getPropertyValue('box-sizing');
    return result;
}

export function repositionCascadingLayout(elements, props){
    var mvert=props.verticalCellSpacing || 0;
    var mhor=props.horizontalCellSpacing || 0;
    var columnWidth = props.columnWidth !== undefined ? props.columnWidth : ((props.parentWidth-(props.numOfColumns-1)*mhor) / props.numOfColumns - 0.3);
    var count = 0, sums = [], spacings={},
        numOfColumns = props.numOfColumns !== undefined ? props.numOfColumns : Math.floor((props.parentWidth+mhor) / (props.columnWidth+mhor));
    for(var i=0;i<numOfColumns;i++){
        sums.push(0);
    }
    _.each(elements, (elm, key)=>{
        var col = 0, max = 999999;
        spacings[key] = getWidthAndSpacing(elm);
        elm.style.position="absolute";
        elm.style.width = (columnWidth
            - (spacings[key].boxSizing!=="border-box"?(spacings[key].left + spacings[key].right):0)
            - (spacings[key].margin.left + spacings[key].margin.right))+"px";
        _.each(sums, (sum, ind) => {
            if (sum < max) {
                col = ind;
                max = sum;
            }
        });
        elm.style.left = (col * (columnWidth + mhor))+"px";
        elm.style.top = (sums[col])+"px";
        sums[col] += elm.offsetHeight+mvert+spacings[key].margin.top+spacings[key].margin.left;
        count = (col + 1) % numOfColumns;
    });
}

export function repositionImagesLayout(elements, props){
    var mvert=props.verticalCellSpacing || 0;
    var mhor=props.horizontalCellSpacing || 0;
    elements = _.values(elements);
    var aspectRatio=[];                     //initial asp ratio before changes
    var hMargins = [], vMargins = [];
    _.each(elements, elm=>{
        var prevWidth=null;
        if(elm.clientWidth===0){            //if width initially 0 for any reason
            prevWidth = elm.style.width;
            elm.style.width = "300px";      //set to some width in order to hopefully extend height for asp. ratio calc
            if(elm.clientHeight===0){       //if height didn't respond to width change, then try changing only height
                elm.style.width = prevWidth;
                elm.style.height = "300px";
                if(elm.clientWidth===0){    //if width didn't respond to height now, the elm is not responsive in any way
                    console.error("element is not responsive when resized!");
                }
            }
        }
        aspectRatio.push(elm.clientHeight!==0 ? elm.clientWidth/elm.clientHeight : 0);
        var spacings = getWidthAndSpacing(elm);
        hMargins.push( spacings.left+spacings.margin.left );
        hMargins.push( spacings.right+spacings.margin.right );
        vMargins.push( spacings.top+spacings.margin.top );
        vMargins.push( spacings.bottom+spacings.margin.bottom );
    });
    var ind = 0, top = 0, left = 0, H;
    while(ind < elements.length){
        var last=ind;
        var ratioSum = 0, hMarginSum = 0, vMarginSum = 0
        do {
            var dividerSum=mhor*(last-ind);
            ratioSum+=aspectRatio[last];
            hMarginSum+=hMargins[2*last]+hMargins[2*last+1];
            vMarginSum+=(vMargins[2*last]+vMargins[2*last+1])*aspectRatio[last];
            H = ( props.parentWidth - hMarginSum - dividerSum + vMarginSum)/ratioSum;
            last++;
        }
        while(last < elements.length && H>props.maxHeight);
        if(H>props.maxHeight){
            H = props.maxHeight;
        }
        H = Math.floor(H);
        for(var k=ind;k<last;k++){
            var current = elements[k];
            var spacings = getWidthAndSpacing(elements[k]);
            var decreaseVertMargins = spacings.margin.top + spacings.margin.bottom,
                decreaseHorMargins = spacings.margin.left + spacings.margin.right;
            var finalHeight, finalWidth;
            if(spacings.boxSizing === "content-box"){
                decreaseVertMargins += spacings.top + spacings.bottom;
                decreaseHorMargins += spacings.left + spacings.right;
                finalHeight = (H-decreaseVertMargins);
                finalWidth = (finalHeight )*aspectRatio[k] ;
            }
            else{
                finalHeight = (H-decreaseVertMargins)
                finalWidth = (finalHeight - (spacings.top+spacings.bottom) )*aspectRatio[k]  + spacings.left+spacings.right  ;
            }
            var prevValue = current.style.width;
            current.style.width=finalWidth+"px";
            var aspRatio = current.clientHeight!==0 ? current.clientWidth/current.clientHeight : 0;
            if(Math.abs(aspectRatio[k] - aspRatio)>0.05){       //in case not maintains asp ratio when changed by width
                current.style.width=prevValue;                  //then try changing height
                current.style.height=finalHeight+"px";
                aspRatio = current.clientHeight!==0 ? current.clientWidth/current.clientHeight : 0;
                if(Math.abs(aspectRatio[k] - aspRatio)>0.05){    //if still not, force both height & width
                    current.style.width=finalWidth+"px";
                }
            }
            current.style.position="absolute";
            current.style.top = top+"px";
            current.style.left = left+"px";
            left += current.offsetWidth + mhor + spacings.margin.left+spacings.margin.right;
        }
        top += H + mvert;
        left=0;
        ind = last;
    }
}

export function getWindowOffset(node) {
    var curtop = 0;
    var curleft = 0;
    var curtopscroll = 0, curleftscroll = 0;
    if (node.offsetParent) {
        do {
            curtop += node.offsetTop;
            curleft += node.offsetLeft;
            curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
            curleftscroll += node.offsetParent ? node.offsetParent.scrollLeft : 0;
        } while (node = node.offsetParent);
        return {
            top: curtop - curtopscroll,
            left: curleft - curleftscroll
        };
    }
}

export function isPromise(obj){
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
