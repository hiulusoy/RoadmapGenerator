import { Response } from 'express';
import { HttpResponseMessageBuilder } from '../model/HttpResponseMessage';

export function sendResponse(res: Response, data: any, totalCount: number | null = null): Response {
  const response = new HttpResponseMessageBuilder()
    .success(true)
    .responseData(data)
    .totalCount(totalCount || (Array.isArray(data) ? data.length : 1))
    .build();
    
  return res.status(200).json(response);
}

export function sendErrorResponse(res: Response, error: string, statusCode: number = 500): Response {
  const response = new HttpResponseMessageBuilder()
    .success(false)
    .msg(error)
    .error(error)
    .build();
    
  return res.status(statusCode).json(response);
}
