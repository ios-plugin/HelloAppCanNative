<li class="scroll-li">
    <div class="scroll-bar uanim scroll-main">
        <div class="ub ub-f1 ub-ac all-padd0 bg-wh">
            <div  class="bg-appIcon appOA ub-img lazy" data-original="<%=data.iconLoc%>"></div>
            <div class="ub-f1 ub ub-ver baseColor paddLeft">
                <div class="ub-f1 ulev0 bot-padd5 name">
                    <%=data.name%>
                </div>
                <div class="ub-f1 ulev-1 baseColor2 curVersion">
                    v<%=data.curVersion%>
                </div>
            </div>
            <div class="state">
            <%=setState(data.state,(data.appCategoryName?data.appCategoryName:data.appCategory))%>
            </div>
        </div>
    </div>
    <div class="scroll-right ub ub-ac ub-pc scroll-delete">
        <div class="ub-f1 ub ub-ac ub-pc red height0">
            <div class="baseColor12 delete"><%=removeTip()%>
            </div>
        </div>
    </div>
</li>
