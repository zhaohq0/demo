import moment from "moment/moment";


export const topicUtils={
    getNowDate(){
        //调用moment  参考官方文档  momentjs.cn
        // return moment().format("YYYY-MMMM-Do hh:mm:ss a");
        moment.locale("zh-cn");
        return moment().format("YYYY-MM-DDTHH:mm:ss");

    },
    transDate(dateStr){
        if (dateStr ==='' || dateStr == null){
            return "";
        }
        return moment(dateStr).format("YYYY-MM-DD HH:mm:ss");
    },
    transDate2(dateStr){
        if (dateStr ==='' || dateStr == null){
            return "";
        }
        return moment(dateStr).format("YYYY-MM-DD");
    }

}