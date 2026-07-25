import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	createParamDecorator,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

export type AuthUser = { sub: string; phone: string }

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwt: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest()
		const header: string | undefined = req.headers?.authorization
		const token = header?.startsWith("Bearer ")
			? header.slice("Bearer ".length)
			: undefined
		if (!token) throw new UnauthorizedException("NO_TOKEN")
		try {
			req.user = await this.jwt.verifyAsync<AuthUser>(token)
			return true
		} catch {
			throw new UnauthorizedException("BAD_TOKEN")
		}
	}
}

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): AuthUser =>
		ctx.switchToHttp().getRequest().user,
)
