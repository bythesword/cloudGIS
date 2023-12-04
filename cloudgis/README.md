

//release 20231010 <br>
开发基线： <br>
   1、开发语言TS，脚手架vite+VUE，打npm包rollup，文档typedoc，单元测试jest <br>
   2、cesium的版本定制1.101（20231010），原因102是webGL2的写法，shader需要变更的比较多。后期在更新<br>
   3、项目cloudgis输出以npm包输出，<br>
   4、包组件目录在 ./src/module中，按照人员名称缩写进行目录<br>
   5、各个组件按照定义名称进行命名，以规划的功能名称为准（20231010，目前还没有）<br>
   6、本工程包含三个项目，<br>
      A、主项目：根目录<br>
      B、文档项目：doc目录<br>
      C、npm包项目：pkg目录<br>
   7、要求大家开发的包要四个对应：<br>
      ts代码（class）--- vue 示例 --- npm包  --- doc文档    <br>
   8、./src/views/home.vue 是index列表，可美化<br>
   9、./src/router/router.js 大家贼鸡增加<br>
   10、typeDoc文档的参见 ./src/module/exp/docExp.ts<br>
   11、打包文件输出在 ./pkg/index.ts,其他的不需要更改<br>
      每个小包的输出在index.ts 中，如：export { Test1 } from "../src/module/exp/test1"   <br>
   12、npm包的名称，目前暂定为cloudgis，发布到需要进行混淆发布<br>
   13、单元测试采用jest，示例参见./test/test1.test.ts，webGL的不用测试，计算和UI的可以测试<br>
后续工作：<br>
   1、文档输出后续可以采用vietpress或vuepress插件进行美好输出，目前（20231010）阶段暂时不进行<br>
   2、k8s等devOPS暂无，2024年再说<br>
   