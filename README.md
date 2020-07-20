## openzeppelin 中文文档

本 openzeppelin 中文文档由登链社区发起，由[Cell Network](https://www.cellnetwork.io/?utm_souce=learnblockchain#/cellhome) 和 [登链社区](https://learnblockchain.cn/) 共同赞助。
如果你对我们的翻译计划感兴趣，来看看[招募译者](https://learnblockchain.cn/article/796) .


未经授权，请勿转载。


## 翻译说明

本文档翻译遵循以下原则：

1. 尊重原文档的结构、格式
2. 采用认领、翻译、校对、发布流程。


**注意事项**

* 为避免译者重复翻译，译者需要提前认领一周的工作量，认领和翻译完成时，都需要及时更新[进度文件](process.md)
* 翻译时，除了用语规范外，还要注意文件间链接跳转正确
* 翻译完成后，译者之间需要相互校对，可以在GitHub提交PR后，译者群里告知一下译者同伴。

## 翻译方法

### 1. 安装工具

openzeppelin 文档采用 AsciiDoc 标记语言编写（参考[语法](https://asciidoctor.cn/docs/asciidoc-syntax-quick-reference/)），使用 Antora 编译为 HTML。

因此我们需要安装 Antora:
```
npm i -g @antora/cli@2.3 @antora/site-generator-default@2.3
``` 

 Antora 编译时依赖一个主题，主题在 ui 目录下，需要把主题构建出来，方法如下：
 ```
 cd ui
 npm install 
 npm run bundle
 ```

 运行以上成功之后，会生成ui/build/oz-build.zip.

然后使用以下命令编译出HTML预览：
```
antora playbook.yml
```

编译出HTML在 build/site 目录下，然后用web服务器加载该目录，例如在在 build/site 目录下，使用`python -m SimpleHTTPServer`命令。

> 直接打开 build/site 下的文件也可以预览，但是有时链接跳转会出现找不到页面的情况，需要手动修改 url 地址。


### 2. 翻译

切出自己的分支进行翻译：

```
git checkout -b mybranch
```

翻译时，及时预览文档，确保文档结构链接正确。

翻译完成后，先自己检查一篇，没问题后，提交Pull Request，告诉队友Review.

## 译者


 


