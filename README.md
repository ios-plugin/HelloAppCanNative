# HelloAppCanNative
1. 引擎都是dynamic framework 需要额外添加到Embed Frameworks的Build Phase中
2. TARGETS -> Build Settings -> Other Linker Flag 添加 -ObjC
3. TARGETS -> Build Settings -> Enable Bitcode 设置为NO
4. 先调用AppCanEngine的`initializeWithConfiguration:`方法初始化引擎 再调用引擎的的其他方法
5. 在AppDelegate里可能会用到的事件中调用引擎相应的方法

