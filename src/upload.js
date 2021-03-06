const _ = require('lodash');
const Router = require('koa-router');
const multer = require('koa-multer');
const fs = require('fs');
const { init, sync } = require('./qiniu.js');

// // 初始化七牛的配置信息
// init({})

const router = Router()

//将上传的信息保存在内存中
var datas = {}

// 上传的文件类型限制
const ALLOW_MIMETYPES = [
  'application/octet-stream', 
  'application/json', 
  'application/zip', 
  'application/x-zip-compressed', 
  'image/png', 
  'image/jpeg']

const fileFilter = (req, file, cb) =>{
  if(_.indexOf(ALLOW_MIMETYPES, file.mimetype)> -1){
    cb(null, 1)
  }else{
    cb({ errno: -801, code: 'TYPE_NOT_ALLOWD', message: 'only images, zip, json accept'})
  }
}

const upload = multer({ dest: 'uploads/' , fileFilter: fileFilter, limits: { fileSize: 5 * 1024 * 1024 }})

// 上传表单以file为文件的字段
const defaultHandler = upload.single('file')

// 捕获异常
const handler = async (ctx, next) => {
  try{
    await defaultHandler(ctx, next)
    let data = ctx.req.file
    datas[data.filename] = data
    let result = await sync(data)
    ctx.success({data: _.assign({id: data.filename}, result)})
  }catch(e){
    ctx.fail(e)
  }
}

// 上传文件的路由
router.post('/upload', handler)

// 下载文件的路由
router.get('/download/:id', async (ctx, next) => {
  let data = datas[ctx.params.id]
  ctx.type = data.mimetype
  ctx.attachment(data.originalname)
  ctx.body = await fs.createReadStream(data.path)
  await next()
})

module.exports = { init, router };
