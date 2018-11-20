# express-kit-universal


文件名： UserComponent.shtml

``` html


<string2-template foo="renderUserInfo" params="name,sex,created">
	<div class="user_info" @click="UserComponent.onClicUserInfo">
		姓名：<%=name%>. 性别：<%=sex%> 时间：<%=formatDate(created)%>
	</div>
</string2-template>





<string2-template foo="render" params="user_list" >
    <div class="ExpressKitUniversal" data-comp="UserComponent">
        <% for (var i = 0 ; i < user_list.length; i ++ ) { %>
            <%=renderName(user_list[i].name,user_list[i].sex)%>
        <%}%>
	</div>
</string2-template>


```




JavaScript入口
```javascript

function defineModule(name,foo) {
  
}

function requireModule(name) {
  
}

exports.requireModule = requireModule;

var UserComponent = get_component("UserComponent")

extend_component(UserComponent,{
    formatDate:function() {
      
    },
    onClicUserInfo:function(dataset,$element){
        
    }
});


var html = UserComponent.render([
    {name:"张三",sex:"男"},
    {name:"张三",sex:"男"}
]);


$("#target").replaceWith(html);


```
