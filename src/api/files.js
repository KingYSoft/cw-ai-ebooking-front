import service from './index'

export const FILE_DOCUMENT_SOURCE = {
  job: 'JOB_DOC',
  warehouse: 'WHS_DOC',
  generatedEdi: 'GEN_EDI',
}

export const downloadFile = (params, signal) =>
  service({
    url: '/files/download',
    method: 'post',
    data: params,
    responseType: 'blob',
    signal,
  })

export const previewFile = (params, signal) =>
  service({
    url: '/files/preview',
    method: 'get',
    params,
    responseType: 'blob',
    signal,
  })

/** GET pdfPath（如 /files/pdf/...）并返回 blob */
export const previewFileByPath = (pdfPath, signal) => {
  const url = String(pdfPath ?? '').trim()
  if (!url) {
    return Promise.reject(new Error('pdfPath is empty'))
  }

  return service({
    url,
    method: 'get',
    responseType: 'blob',
    signal,
  })
}
