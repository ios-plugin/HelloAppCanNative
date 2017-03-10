# HelloAppCanNative
## 初始化

### 引入AppCanNative资源

1. 将`engine`目录和`uexFramework`下的.framework文件以Group方式引入工程,并将其中的dynamic framework额外添加到Embed Frameworks的Build Phase中
2. 将`uexLib`目录下的.a文件以Group方式引入工程
3. 将根目录下的.bundle文件以Group方式引入工程
4. 将根目录下的`plugin.xml`以及`widget`文件夹以Folder Reference方式引入工程
5. 如果有用到**在线升级**、**统计分析**等企业功能,将根目录下的`WidgetOnePseudoDelegate.h` `WidgetOnePseudoDelegate.m` ` Beqtucontent.h` `Beqtucontent.m` 这4个文件引入工程并参与编译
6. 将根目录下`AppCanPlugin-Info.plist`中的键值对合并入工程的info.plist中

### 配置工程

1. TARGETS -> Build Settings -> Other Linker Flag 添加 -ObjC
2. TARGETS -> Build Settings -> Enable Bitcode 设置为NO
3. 先调用AppCanEngine的`initializeWithConfiguration:`方法初始化引擎 再调用引擎的的其他方法
4. 在AppDelegate里可能会用到的事件中调用引擎相应的方法



## 调试

### 如何调试引擎

1. 将[引擎源码](https://github.com/appcanopensource/appcan-ios)clone至本地,**并按`README.md`中的步骤进行初始化**
2. 新建一个workspace,将app工程添加至其中
3. 将以下引擎工程及其依赖工程添加至workspace中
   * `appcan-ios/AppCanEngine.xcodeproj`
   * `appcan-ios/Carthage/Checkouts/AppCanKit/AppCanKit.xcodeproj`
   * `appcan-ios/Carthage/Checkouts/Ono/Ono.xcodeproj`
   * `appcan-ios/Carthage/Checkouts/pop/pop.xcodeproj`
4. 移除app工程中的引擎frameworks引用,并改用workspace中的引擎工程的Products替代
5. 编辑app的Scheme,关闭Parallelize Build,并将引擎工程的Targets顺次添加至app的Targets之前
6. clean工程 开始调试

### 如何调试插件

1. 完成上述引擎调试步骤
2. 将[插件源码](https://github.com/ios-plugin/)clone至本地
3. 将插件工程（形如`EUExXXX.xcodeproj`）添加至workspace中
4. 移除app工程中的引擎.a或者.framework引用,并改用workspace中的引擎工程的Products替代
5. clean工程 开始调试