function eachList(data,id,i){
    data.forEach(element => {
        if(element.id==id){
            element.choosed=1;
            element.children.forEach((item,n)=>{
                if(n==i){
                    item.choosed= 1;
                    if(item.children && item.children.length>0){
                        item.children.forEach((c,s)=>{
                            if(c.type==2)c.choosed=2;
                        })
                    }
                }else{
                    item.choosed= 0;
                    if(item.children && item.children.length>0){
                        item.children.forEach((c,s)=>{
                            if(c.type==2)c.choosed=0;
                        })
                    }
                }
            })
        }
        if(element.children && element.children.length>0)eachList(element.children,id,i);
    });
}
function initList(data,type,level){
    data.map((item,index) => {
        if(item.type==type && item.level==level){
            item.choosed=2;
        }
        if(item.children && item.children.length>0)initList(item.children,type,level);
    });
}

export default {
    checkBtn(state, id,i){
        eachList(state.QUES_ILLS,id,i)
    },
    getInitList(state){
        initList(state.QUES_ILLS,2,3);
    },
}
