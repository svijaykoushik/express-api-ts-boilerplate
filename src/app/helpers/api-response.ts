export class ApiResponse {
    public status_code: number;
    public message?: string;

    public constructor(
        status_code: number,
        data?: Record<string, any>,
        message?: string
    ) {
        this.status_code = status_code;
        this.message = message;

        if (data) {
            for (const [key, value] of Object.entries(data)) {
                this[key] = value;
            }
        }
    }
}
