import { ApiException, ExceptionDetails } from './api-exception';


export class DomainRestrictedException extends ApiException {
    constructor(domain) {
        super(
            403,
            'Domain Blocked by CORS policy',
            new ExceptionDetails(
                'DOMAIN_BLOCKED',
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
