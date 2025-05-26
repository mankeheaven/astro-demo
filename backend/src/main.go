package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// 创建Echo实例
	e := echo.New()

	// 中间件
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// 路由
	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"message": "欢迎使用Golang Echo API",
		})
	})

	// API路由组
	api := e.Group("/api")
	{
		api.GET("/health", func(c echo.Context) error {
			return c.JSON(http.StatusOK, map[string]string{
				"status": "健康",
			})
		})
	}

	// 启动服务器
	e.Logger.Fatal(e.Start(":8080"))
}
