import service from './index'

/** POST /pdf/generate — 生成业务 PDF */
export const shipmentPdfGenerate = params =>
  service({
    url: '/pdf/generate',
    method: 'post',
    data: params,
  })
