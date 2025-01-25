import { ApiException, ExceptionDetails } from './api-exception';

export class DomainRestrictedException extends ApiException {
    constructor(domain: string) {
        super(
            403,
            new ExceptionDetails(
                'domain_blocked',
                'Domain Blocked by CORS policy',
                null,
                {
                    domain
                }
            )
        );
    }
}

module.exports = {
    DomainRestrictedException
};
