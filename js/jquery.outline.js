(function($){

    function createLink(idSuffix,text)
    {
        var link= document.createElement('a');
        link.href='#outline_'+idSuffix;
        link.innerHTML=text;
        return link;
    }

    function createHeader(wrapDiv,element)
    {
        var header = document.createElement("h3");
        header.innerHTML=element.innerHTML;
        wrapDiv.appendChild(header);
    }

    function createOutline(id,elements,hasTitle)
    {
        var i=0;//index of elements
        var wrapDiv = document.getElementById(id);
        hasTitle&&createHeader(wrapDiv,elements[i++]);

        var ul = document.createElement("ul");
        var len=elements.length;

        var li=document.createElement('li');
        var link= createLink(i,elements[i++].innerHTML);
        li.appendChild(link);
        ul.appendChild(li); //create first li element to compare

        for (; i < len; i++){

            li= createElement(li,elements[i],elements[i-1].nodeName,i)
        }

        wrapDiv.appendChild(ul);
    }

    function createElement(current,element,lastNodeName,index)
    {
        var link= createLink(index,element.innerHTML);
        var ul,
            li=document.createElement('li');
        li.appendChild(link);
        if(element.nodeName>lastNodeName)//eg. H3>H2
        {
            ul = document.createElement("ul");
            ul.appendChild(li);
            current.appendChild(ul);
        }
        else if(element.nodeName===lastNodeName)
        {
            current.parentNode.appendChild(li);
        }
        else
        {
            //当为ul时继续查找
            while(current.nodeName.toUpperCase()==='UL'||(document.getElementById(current.firstChild.getAttribute('href').substring(1)).nodeName!==element.nodeName))
            {
                if(current.parentNode)
                {
                    current=current.parentNode;
                }
                else
                {
                    //如果没有父节点，说明是顶层的ul，把当前元素置为顶层ul第一个子元素,方便插入
                    current=current.firstChild;
                    break;
                }

            }

            current.parentNode.appendChild(li);

        }
        return li;

    }

    function validate(option)
    {
        if(!option.id)
        {
             throw new TypeError("id is Required attribute");
        }
    }


    var ol={
        outline:function(option)
        {

            validate(option);

            var option= $.extend({
                selector:'body',  //css选择器，选择的范围
                hArray:['h1','h2','h3','h4','h5','h6'], //要识别的header
                hasTitle:false //范围内是否第一个是标题
            },option);

            var hSelector=option.hArray.join(',');
            var index=0;
            $(option.selector).find(hSelector).each(function()
            {
                this.setAttribute('id','outline_'+index++);
            });
            createOutline(option.id,$(option.selector).find(hSelector),option.hasTitle)

        }

    };





    $.extend(ol);





})(jQuery);/**
 * Created by Lucien on 7/14/2015.
 */


$.outline({id:'sub-outline',selector:'article',hasTitle:true});
