const middleware = (Router) => async (ctx, next) => {
  ctx.body = await Router
                    .find(ctx.method, ctx.path, ctx.request.body, ctx.headers)
                    .catch((err) => {
                      console.log(err.stack);
                      ctx.status = err.code||ctx.status;
                      return err;
                    });
}
export default middleware
