// types.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface Account {
    userId: number;
    username: string;
    email: string;
    roleId: number;
}
export interface LoginResponse {
    status: boolean;            // Trạng thái của phản hồi (thành công hay không)
    message: string;           // Thông báo từ server
    data: {
        token: string;         // Token xác thực
        account: {
            accountId: number;   // ID tài khoản
            fullName: string;    // Tên đầy đủ của người dùng
            email: string;        // Địa chỉ email của người dùng
            createdDate: string | null; // Ngày tạo tài khoản (có thể null)
            lastLoginDate: string | null; // Ngày đăng nhập cuối (có thể null)
            isActive: boolean;    // Trạng thái tài khoản (đang hoạt động hay không)
            roleId: number;       // ID vai trò của người dùng
            imagePath: string | null; // Đường dẫn đến hình ảnh của người dùng (có thể null)
        };
    };
}

