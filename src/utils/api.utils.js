import { HTTP_RESPONSE } from '../constants/api.constants';

/**
 * Clase ApiResponse para formatear respuestas de API
 */
export class ApiResponse {
  constructor(type, message, data = null) {
    this.type = type;
    this.message = message;
    this.data = data;
  }

  // Métodos estáticos para facilitar la creación de respuestas
  static success(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.SUCCESS, message, data);
  }

  static warning(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.WARNING, message, data);
  }

  static error(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.ERROR, message, data);
  }

  static info(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.INFO, message, data);
  }

  static httpOk(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.HTTP_200_OK, message, data);
  }

  static permissionError(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.PERMISION_ERROR, message, data);
  }

  static malformedJson(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.MALFORMED_JSON, message, data);
  }

  static accessDenied(message, data = null) {
    return new ApiResponse(HTTP_RESPONSE.ACCESS_DENIED, message, data);
  }
}

/**
 * Normaliza cualquier respuesta de API al formato ApiResponse estándar
 * @param {Object} response - La respuesta recibida del backend
 * @returns {ApiResponse} Respuesta normalizada con formato ApiResponse
 */
export const normalizeApiResponse = (response) => {
  // Si ya es una instancia de ApiResponse o tiene la estructura correcta
  if (response && 
      typeof response === 'object' && 
      'type' in response && 
      'message' in response && 
      'data' in response) {
    
    // Verificamos si el tipo es uno de los válidos en HTTP_RESPONSE
    const validTypes = Object.values(HTTP_RESPONSE);
    const type = validTypes.includes(response.type) 
                ? response.type 
                : HTTP_RESPONSE.SUCCESS;
    
    return new ApiResponse(
      type,
      response.message || '',
      response.data
    );
  }
  
  // Si es un objeto pero no tiene la estructura correcta
  if (response && typeof response === 'object') {
    // Si tiene data pero no los otros campos
    if ('data' in response) {
      return ApiResponse.success(
        'Datos obtenidos correctamente',
        response.data
      );
    }
    
    // Si no tiene campo data, tratamos todo el objeto como data
    return ApiResponse.success(
      'Datos obtenidos correctamente',
      response
    );
  }
  
  // Si es un valor primitivo o null/undefined
  return ApiResponse.success(
    'Operación completada',
    response
  );
};

/**
 * Maneja errores de API y los convierte al formato ApiResponse
 * @param {Error} error - Error capturado
 * @returns {ApiResponse} Respuesta de error con formato ApiResponse
 */
export const handleApiError = (error) => {
  // Si el error ya tiene formato de respuesta API
  if (error && 
      typeof error === 'object' && 
      'type' in error && 
      'message' in error) {
    return normalizeApiResponse(error);
  }
  
  // Si es un error de red o servidor
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return ApiResponse.error('Error de conexión con el servidor', null);
  }
  
  // Para errores de autenticación, verificamos si hay algún indicio
  if (error.status === 401 || error.statusCode === 401) {
    return ApiResponse.permissionError('No tiene permisos para realizar esta acción', null);
  }
  
  // Para errores de acceso denegado
  if (error.status === 403 || error.statusCode === 403) {
    return ApiResponse.accessDenied('Acceso denegado', null);
  }
  
  // Error genérico
  return ApiResponse.error(
    error.message || 'Ocurrió un error inesperado', 
    null
  );
};
