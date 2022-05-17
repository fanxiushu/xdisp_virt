////render to window
/// Fanxiushu 2022-05-17 ,
/// 演示如何展示从indirect_display驱动写到共享内存的图像数据，驱动需要开启 capture_image 功能，具体介绍请查阅驱动的配置文件。
#include <Windows.h>
#include <stdio.h>
#include <conio.h>

///以下数据结构从驱动接口申明文件中获取
/////内存共享方式截图
#define MONITOR_SHMEM_INFO   "FanxiushuIndirectDisplay_Info"
#define MONITOR_SHMEM_IMAGE  "FanxiushuIndirectDisplay_Image"

#define DIRTY_RECT_QUEUE_SIZE     50000

struct dirty_rect_queue_t
{
	unsigned int  next_index; /// 下一个将要绘制的位置, 从 0到 ( DIRTY_RECT_QUEUE_SIZE - 1 ),循环队列指示器
							  ///
	RECT          queue[DIRTY_RECT_QUEUE_SIZE]; ///
};

struct monitor_shminfo_t
{
	char                magic[16];
	int                 monitor_index;  ///
	unsigned int        cx;
	unsigned int        cy;
	////
	dirty_rect_queue_t  dirty_rects; /////
};


//从网上找的算法，速度极慢的生成圆形桌面图像数据
#include <math.h>
void DealWithImgData(BYTE *srcdata, BYTE *drcdata, int width, int height)//参数一为原图像的数据区首指针，参数二为贴合后图像的数据区首指针，参数三为图像的宽，参数四为图像的高
{
	int l_width = width * 4; // WIDTHBYTES(width * 24);//计算位图的实际宽度并确保它为4byte的倍数 
	double radius1 = (width+height) / 4;//贴合球面半径
	double radius2 = radius1*radius1;//半价的平方
	double x1, y1;//目标在球正视图中的坐标位置
	double x, y;//目标在球正视图中对应原图的坐标位置
	double middle2 = 2 * radius1 / 3.1416;//计算过程式子
	double matan;//目标与圆心连线与x轴的夹角
	int pixel_point;//遍历图像指针
	int pixel_point_row;//遍历图像行首指针
	double oa;//点对应弧长度

			  //双线性插值算法相关变量
	int i_original_img_hnum, i_original_img_wnum;//目标点坐标
	double distance_to_a_y, distance_to_a_x;//在原图像中与a点的水平距离  
	int original_point_a, original_point_b, original_point_c, original_point_d;

	for (int hnum = 0; hnum < height; hnum++)
	{
		pixel_point_row = hnum*l_width;
		for (int wnum = 0; wnum < width; wnum++)
		{
			if ((hnum - height / 2)*(hnum - height / 2) + (wnum - width / 2)*(wnum - width / 2) < radius2)//在球体视场内才处理
			{
				pixel_point = pixel_point_row + wnum * 4;//数组位置偏移量，对应于图像的各像素点RGB的起点
														 /***********球面贴合***********/
				x1 = wnum - width / 2;
				y1 = height / 2 - hnum;

				if (x1 != 0)
				{
					oa = middle2*asin(sqrt(y1*y1 + x1*x1) / radius1);//这里在确定图像大小的情况下可以用查表法来完成，这样会大大的提高其效率
					matan = atan2(y1, x1);
					x = cos(matan)*oa;
					y = sin(matan)*oa;
				}
				else
				{
					y = asin(y1 / radius1)*middle2;
					x = 0;
				}
				/***********球面贴合***********/

				/***********双线性插值算法***********/
				i_original_img_hnum = (height / 2 - y);
				i_original_img_wnum = (x + width / 2);
				distance_to_a_y = (height / 2 - y) - i_original_img_hnum;
				distance_to_a_x = (x + width / 2) - i_original_img_wnum;//在原图像中与a点的垂直距离  

				original_point_a = i_original_img_hnum*l_width + i_original_img_wnum * 4;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点A    
				original_point_b = original_point_a + 4;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点B  
				original_point_c = original_point_a + l_width;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点C   
				original_point_d = original_point_c + 4;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点D  

				if (hnum == height - 1)
				{
					original_point_c = original_point_a;
					original_point_d = original_point_b;
				}
				if (wnum == width - 1)
				{
					original_point_a = original_point_b;
					original_point_c = original_point_d;
				}

				drcdata[pixel_point + 0] =
					srcdata[original_point_a + 0] * (1 - distance_to_a_x)*(1 - distance_to_a_y) +
					srcdata[original_point_b + 0] * distance_to_a_x*(1 - distance_to_a_y) +
					srcdata[original_point_c + 0] * distance_to_a_y*(1 - distance_to_a_x) +
					srcdata[original_point_c + 0] * distance_to_a_y*distance_to_a_x;
				drcdata[pixel_point + 1] =
					srcdata[original_point_a + 1] * (1 - distance_to_a_x)*(1 - distance_to_a_y) +
					srcdata[original_point_b + 1] * distance_to_a_x*(1 - distance_to_a_y) +
					srcdata[original_point_c + 1] * distance_to_a_y*(1 - distance_to_a_x) +
					srcdata[original_point_c + 1] * distance_to_a_y*distance_to_a_x;
				drcdata[pixel_point + 2] =
					srcdata[original_point_a + 2] * (1 - distance_to_a_x)*(1 - distance_to_a_y) +
					srcdata[original_point_b + 2] * distance_to_a_x*(1 - distance_to_a_y) +
					srcdata[original_point_c + 2] * distance_to_a_y*(1 - distance_to_a_x) +
					srcdata[original_point_c + 2] * distance_to_a_y*distance_to_a_x;
				/***********双线性插值算法***********/
			}
		}
	}
}


struct render_window
{
	HBITMAP             hbmp;
	HDC                 memdc;
	////
	HANDLE              handle1;
	HANDLE              handle2;
	monitor_shminfo_t*  shinfo;
	byte*               image_data;

	HWND                hwnd;
};

static LRESULT CALLBACK _WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam) 
{
	render_window* render = (render_window*)GetWindowLongPtr(hwnd, GWLP_USERDATA);
	if (render) {

	}
	switch (message)
	{
	case WM_DESTROY:
		PostQuitMessage(0);
		break;
	case WM_LBUTTONDOWN:
		::SendMessage(hwnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
		break;
	}
	return DefWindowProc(hwnd, message, wParam, lParam);
}
static DWORD CALLBACK update_thread(void* _p)
{
	render_window* render = (render_window*)_p;
	////
	unsigned int next_index = 0;
	/// test
	int w = render->shinfo->cx;
	int h = render->shinfo->cy;
//	byte* dst = (byte*)malloc(w*h * 4); 
	BITMAPINFOHEADER bi; memset(&bi, 0, sizeof(bi));
	bi.biSize = sizeof(bi);
	bi.biWidth = w;
	bi.biHeight = -h; // 从上朝下扫描
	bi.biPlanes = 1;
	bi.biBitCount = 32; //BGRA
	bi.biCompression = BI_RGB;
	bi.biSizeImage = 0;
	HDC hdc = GetDC(NULL); //屏幕DC
	HDC mdc = CreateCompatibleDC(hdc);
	PVOID data = NULL;
	HBITMAP bmp = CreateDIBSection(hdc, (BITMAPINFO*)&bi, DIB_RGB_COLORS, (void**)&data, NULL, 0);
	ReleaseDC(NULL, hdc);
	SelectObject(mdc, bmp); ///

	/////
	while (1) {
		///
		bool is_change = false;
		if (next_index != render->shinfo->dirty_rects.next_index) {
			is_change = true;
			next_index = render->shinfo->dirty_rects.next_index;
		}

		if (is_change) {
			///在此处可以对图像数据进行额外处理
			bool do_image_conv = false;
		//	DealWithImgData((BYTE*)render->image_data, (BYTE*)data, render->shinfo->cx, render->shinfo->cy);

			/////
			RECT rc; GetClientRect(render->hwnd, &rc);
			HDC hdc = GetDC(render->hwnd);
			SetStretchBltMode(hdc, COLORONCOLOR);

			StretchBlt(hdc, 0, 0, rc.right - rc.left, rc.bottom - rc.top,
				do_image_conv ? mdc : render->memdc, 
				0, 0, render->shinfo->cx, render->shinfo->cy, SRCCOPY);

			ReleaseDC(render->hwnd, hdc);
		}
		/////
		Sleep(16);
	}
	return 0;
}

render_window* create_render(int index)
{
	char name[256];
	sprintf(name, "Global\\%s_%d", MONITOR_SHMEM_INFO, index);
	HANDLE handle1 = OpenFileMapping(FILE_MAP_ALL_ACCESS, FALSE, name);
	if (!handle1) {
		printf("** OpenFileMapping [%s] err=%d\n",name, GetLastError() );
		return NULL;
	}
	monitor_shminfo_t* info=(monitor_shminfo_t*)MapViewOfFile(handle1, FILE_MAP_ALL_ACCESS, 0, 0, sizeof(monitor_shminfo_t));
	if (!info) {
		CloseHandle(handle1);
		return NULL;
	}
	sprintf(name, "Global\\%s_%d_%dX%d", MONITOR_SHMEM_IMAGE, index, info->cx, info->cy);
	HANDLE handle2 = OpenFileMapping(FILE_MAP_ALL_ACCESS, FALSE, name);
	if (!handle2) {
		printf("** OpenFileMapping [%s] err=%d\n", name, GetLastError());
		UnmapViewOfFile(info);
		CloseHandle(handle1);
		return NULL;
	}
	
	int w = info->cx;
	int h = info->cy;
	////
	BITMAPINFOHEADER bi; memset(&bi, 0, sizeof(bi));
	bi.biSize = sizeof(bi);
	bi.biWidth = w;
	bi.biHeight = -h; // 从上朝下扫描
	bi.biPlanes = 1;
	bi.biBitCount = 32; //BGRA
	bi.biCompression = BI_RGB;
	bi.biSizeImage = 0;
	HDC hdc = GetDC(NULL); //屏幕DC
	HDC mdc = CreateCompatibleDC(hdc);
	PVOID data = NULL;
	HBITMAP bmp = CreateDIBSection(hdc, (BITMAPINFO*)&bi, DIB_RGB_COLORS, (void**)&data, handle2, 0);
	ReleaseDC(NULL, hdc);
	if (!bmp) {
		printf("CreateDIBSection err=%d\n", GetLastError());
		
		return NULL;
	}
	SelectObject(mdc, bmp); ///

	/////
	render_window* render = new render_window;

	render->handle1 = handle1; render->handle2 = handle2;
	render->hbmp = bmp;
	render->memdc = mdc;
	render->image_data = (byte*)data;
	render->shinfo = info;

	HMODULE hmod = GetModuleHandle(NULL);
	HWND hwnd;
	char* cls_name = "Fanxiushu.Test";
	WNDCLASS wndcls = { CS_HREDRAW | CS_VREDRAW, _WndProc, 0,0, hmod , NULL,
		LoadCursor(NULL,IDC_ARROW), NULL, NULL, cls_name };
	RegisterClass(&wndcls);
	hwnd = CreateWindow(cls_name, "", 
		WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT,
	//	WS_POPUP, 0, 0, 2560, 1600, 
		NULL, NULL, hmod, NULL);
	if (!hwnd) {
		printf("*** Can not Create Message DxHook Window.\n");
		///
		return NULL;
	}
	SetWindowLongPtr(hwnd, GWLP_USERDATA, (LONG_PTR)render);
	render->hwnd = hwnd;

	/////
	ShowWindow(hwnd, SW_SHOW);
	UpdateWindow(hwnd);

	DWORD tid;
	CreateThread(NULL, 0, update_thread, render, 0, &tid);

	return render;
}

#if 1

int main(int argc, char** argv)
{
	SetProcessDPIAware();
	printf("Please Input Indirect Display Index [Range: 0 - 15]: ");
	int index = 0; scanf("%d", &index);
	render_window* render = create_render(index);
	if (!render) {
		printf("[ESC] to exit.\n"); while (_getch() != 27);
		return -1;
	}
	////
	MSG msg;
	while (GetMessage(&msg, 0, 0, 0)) {
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}

	return 0;
}

#endif

