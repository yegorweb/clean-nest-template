import { HttpStatus } from "@nestjs/common";
import { AppError } from "./app-error";

export class ValidationError extends AppError {
  constructor(message: string, additionalData = {}) {
    super(message, HttpStatus.BAD_REQUEST, additionalData)
  }
}