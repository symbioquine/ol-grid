(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{LZFG:function(e,t,a){e.exports={articleList:"PostsListing-module--article-list--3ReSK",articleBox:"PostsListing-module--article-box--3M6_I",right:"PostsListing-module--right--2MxCO",meta:"PostsListing-module--meta--3cFzL"}},Mdw5:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",(function(){return m}));var n=a("q1tI"),r=a.n(n),i=a("TJpk"),l=a.n(i),o=a("83Zx"),c=a("lPsB"),s=a("IpnI"),d=a.n(s);t.default=function(e){var t=e.data,a=e.pageContext;return r.a.createElement(o.a,null,r.a.createElement("main",null,r.a.createElement(l.a,{title:' "'+a.category+'" - '+d.a.siteTitle}),r.a.createElement("h1",null,"Category:"," ",a.category),r.a.createElement(c.a,{postEdges:t.allMarkdownRemark.edges})))};var m="89373373"},lPsB:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n),i=a("Wbzz"),l=a("LZFG"),o=a.n(l);t.a=function(e){var t=e.postEdges,a=function(){var e=[];return t.forEach((function(t){e.push({path:t.node.fields.slug,tags:t.node.frontmatter.tags,categories:t.node.frontmatter.categories,cover:t.node.frontmatter.cover,title:t.node.frontmatter.title,date:t.node.fields.date,excerpt:t.node.excerpt,timeToRead:t.node.timeToRead})})),e}();return r.a.createElement("div",{className:o.a.articleList},a.map((function(e){return r.a.createElement(i.Link,{to:e.path,key:e.title},r.a.createElement("article",{className:o.a.articleBox},r.a.createElement("div",{className:o.a.right},r.a.createElement("h3",null,e.title),r.a.createElement("div",{className:o.a.meta},e.date," — ",r.a.createElement("span",null,e.categories.join(" / "))," ","— ",e.timeToRead," Min Read"," "),r.a.createElement("p",null,e.excerpt))))})))}}}]);
//# sourceMappingURL=component---src-templates-category-js-fcdefe92c9cdc90f3a48.js.map