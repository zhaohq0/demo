//统一api管理
import instance from "./axios";
// data json         /mall/cms-topic-comment/one/{id}

const topicCommentPage=(data)=>{
   return instance.request({
    url:'mall/cms-topic-comment/page',
    method:'post',
    data
   })
}
const topicCommentDelId=(params)=>{
    return instance.request({
        url:'mall/cms-topic-comment/del/'+params.id,
        method:"get",
        // params
    })
}
const topicCommentAdd=(data)=>{
    return instance.request({
        url:'mall/cms-topic-comment/add',
        method:'post',
        data
    })
}
const topicCommentEdit=(data)=>{
    return instance.request({
        url:'mall/cms-topic-comment/edit',
        method:'post',
        data
    })
}
// CmsTopicCategory(话题类别)
const topicCommentCategoryPage=(data)=>{
    return instance.request({
     url:'mall/cms-topic-comment-category/page',
     method:'post',
     data
    })
 }

 const topicCommentCategoryOne=(data)=>{
    return instance.request({
     url:'/mall/cms-topic-comment-category/one/{id}',
     method:'post', 
     data
    })
 }

//  const topicCommentCategoryDelId=(params)=>{
//      return instance.request({
//          url:'mall/cms-topic-comment-category/del/'+params.id,
//          method:"get",
//          // params
//      })
//  }

//  const topicCommentCategoryAdd=(data)=>{
//      return instance.request({
//          url:' /mall/cms-topic-comment-category/add',
//          method:'post',
//          data
//      })
//  }
//  const topicCommentCategoryEdit=(data)=>{
//      return instance.request({
//          url:'mall/cms-topic-comment-category/edit',
//          method:'post',
//          data
//      })
//  }



// const isEven = n => n % 2 === 0;


export {
    topicCommentPage,
    topicCommentDelId,
    topicCommentAdd,
    topicCommentEdit,
    topicCommentCategoryPage,
    topicCommentCategoryOne

} 