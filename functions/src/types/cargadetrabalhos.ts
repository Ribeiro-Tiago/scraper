export interface DateValidator {
	post: {
		day: string;
		month: string;
	};
	today: {
		day: number;
		month: number;
	};
}
