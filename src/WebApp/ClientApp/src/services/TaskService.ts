import { IUserService } from "./UserService";

export interface ITaskItem {
    readonly id: string;
    readonly title: string;
    readonly isCompleted: boolean;
    readonly createdBy: string;
    readonly updatedBy: string;
}

export interface ITaskService {
    getMyTasks(): Promise<ITaskItem[]>;
    addTask(title): Promise<ITaskItem>;
    markTaskAsCompleted(taskId): Promise<ITaskItem>;
    markTaskAsOpen(taskId): Promise<ITaskItem>;
    resetMyTasks(): Promise<ITaskItem[]>;
}

export class TaskService implements ITaskService {
    private readonly userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async getMyTasks(): Promise<ITaskItem[]> {
        const requestOptions = {
            method: "get",
            headers: {}
        };

        this.injectHeaders(requestOptions.headers);

        const response = await fetch("api/tasks/get-all", requestOptions);

        if (!response.ok) {
            throw new Error(`Task list could not be loaded. (HTTP ${response.status})`);
        }

        const data = await response.json();

        return data.map(item => ({
            id: item.id,
            title: item.title,
            isCompleted: item.isCompleted,
            createdBy: item.createdBy.name,
            updatedBy: item.updatedBy.name
        }));
    }

    async addTask(title): Promise<ITaskItem> {
        const requestOptions = {
            method: "post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ title: title })
        };

        this.injectHeaders(requestOptions.headers);

        const response = await fetch("api/tasks/add-new", requestOptions);

        if (!response.ok) {
            throw new Error(`Task could not be added. (HTTP ${response.status})`);
        }

        const item = await response.json();

        return ({
            id: item.id,
            title: item.title,
            isCompleted: item.isCompleted,
            createdBy: item.createdBy.name,
            updatedBy: item.updatedBy.name
        });
    }

    async markTaskAsCompleted(taskId): Promise<ITaskItem> {
        const requestOptions = {
            method: "put",
            headers: {}
        };

        this.injectHeaders(requestOptions.headers);

        const response = await fetch(`api/tasks/${taskId}/mark-as-completed`, requestOptions);

        if (!response.ok) {
            throw new Error(`Task could not be completed. (HTTP ${response.status})`);
        }

        const item = await response.json();

        return ({
            id: item.id,
            title: item.title,
            isCompleted: item.isCompleted,
            createdBy: item.createdBy.name,
            updatedBy: item.updatedBy.name
        });
    }

    async markTaskAsOpen(taskId): Promise<ITaskItem> {
        const requestOptions = {
            method: "put",
            headers: {}
        };

        this.injectHeaders(requestOptions.headers);

        const response = await fetch(`api/tasks/${taskId}/mark-as-open`, requestOptions);

        if (!response.ok) {
            throw new Error(`Task could not be opened. (HTTP ${response.status})`);
        }

        const item = await response.json();

        return ({
            id: item.id,
            title: item.title,
            isCompleted: item.isCompleted,
            createdBy: item.createdBy.name,
            updatedBy: item.updatedBy.name
        });
    }

    async resetMyTasks(): Promise<ITaskItem[]> {
        const requestOptions = {
            method: "put",
            headers: {}
        };

        this.injectHeaders(requestOptions.headers);

        const response = await fetch(`api/tasks/reset`, requestOptions);

        if (!response.ok) {
            throw new Error(`Task list could not be reset. (HTTP ${response.status})`);
        }

        const data = await response.json();

        return data.map(item => ({
            id: item.id,
            title: item.title,
            isCompleted: item.isCompleted,
            createdBy: item.createdBy.name,
            updatedBy: item.updatedBy.name
        }));
    }

    private injectHeaders(headers: IDictionary<string>) {
        if (this.userService.isAuthenticated) {
            headers["Authorization"] = `Bearer ${this.userService.identity.accessToken}`;
        }
    }
}

export interface IDictionary<T> {
    [key: string]: T;
}