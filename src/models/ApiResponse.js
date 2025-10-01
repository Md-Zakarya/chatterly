export class ApiResponse {

    constructor(data) {
        this.message = data.message || '';
        this.status = data.working || false;
    }

}