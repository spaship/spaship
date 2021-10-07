package io.spaship.operator.config;

import io.spaship.operator.type.ErrorResponse;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.Objects;

@Provider
public class RestExceptionMapperConfig implements ExceptionMapper<Throwable> {
    @Override
    public Response toResponse(Throwable throwable) {
        String errorMessage = Objects.isNull(throwable.getMessage()) ? throwable.toString() : throwable.getMessage();
        var response = new ErrorResponse(errorMessage, "500",
                "https://spaship.io/");
        return Response.ok().entity(response).build();
    }
}
