#语义化大纲



##结构化

* 自动生成大纲,推广结构化的内容。
* 网站博客内容语义化，如果不规范的使用header马上发现。
* 

##兼容
兼容所有的主流浏览器

*IE8+*

##试一试
        
##如何使用
1. 先引用jQuery
2. 引用jquery.outline.js
3. 在要生成大纲容器标签加属性*data-outline*  属性值为要生成大纲区域的选择器。    
	如 data-outline="article" 生成大纲区域article。
	
#####手动调用
```js
        $.outline({
            contentSelector: '[data-outline]',
            selector: $('[data-outline]').data('outline')});
			
			
```

#####选项说明
```js
				必选值
				contentSelector:	//生成大纲后存在的容器 
				可选值
                selector: 'body',  //css选择器，选择的范围
                hArray: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], //要识别的header
                addSpy: true,//是否添加滚动事件监听
                hasTitle: false, //范围内是否第一个是标题
                offset: 20 //偏离的位置
```