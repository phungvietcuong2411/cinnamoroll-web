import { useEffect, useState } from "react"
import {
    getTotalRevenue,
    getTodayRevenue,
    getRevenueByDay,
    getRevenueByMonth,
    getRevenueByProductType,
    getTopSellingProducts
} from "../../../services/revenue.service"
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"
import { Calendar, BarChart3, TrendingUp } from "lucide-react"

const money = (v) => Number(v || 0).toLocaleString("vi-VN")

function RevenueManagement() {
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [todayRevenue, setTodayRevenue] = useState(0)

    // Ngày đích người dùng chọn (mặc định hôm nay)
    const [endDate, setEndDate] = useState(() => {
        const today = new Date()
        return today.toISOString().slice(0, 10)
    })

    const [dayRevenue, setDayRevenue] = useState([]) // 7 ngày đã fill đủ

    const [year, setYear] = useState(new Date().getFullYear())
    const [monthRevenue, setMonthRevenue] = useState([])
    const [typeRevenue, setTypeRevenue] = useState([])
    const [topProducts, setTopProducts] = useState([])

    // Tạo danh sách 7 ngày từ ngày đích trở về trước
    const generate7Days = (end) => {
        console.log("🔍 generate7Days: Ngày đích đầu vào:", end)
        const days = []
        // Sử dụng UTC để tránh lệch ngày do timezone
        const [year, month, day] = end.split('-').map(Number)
        const endDateUTC = Date.UTC(year, month - 1, day)
        for (let i = 6; i >= 0; i--) {
            const current = new Date(endDateUTC - i * 24 * 60 * 60 * 1000)
            const yyyy = current.getUTCFullYear()
            const mm = String(current.getUTCMonth() + 1).padStart(2, '0')
            const dd = String(current.getUTCDate()).padStart(2, '0')
            days.push(`${yyyy}-${mm}-${dd}`)
        }
        console.log("📅 7 ngày được tạo:", days)
        return days // [ngày cũ nhất, ..., ngày đích]
    }

    // Fill dữ liệu từ API vào đúng 7 ngày (thiếu thì = 0)
const prepareChartData = (apiData, dateList) => {
    console.log("🟢 prepareChartData: Dữ liệu API thô:", apiData)
    console.log("🟢 prepareChartData: Danh sách 7 ngày:", dateList)

    const map = new Map()

    ;(apiData || []).forEach(item => {
        let dateStr = item.date
        console.log("  🔎 Item date gốc:", dateStr)

        if (dateStr) {
            const utcDate = new Date(dateStr)
            const vnDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000)
            const yyyy = vnDate.getFullYear()
            const mm = String(vnDate.getMonth() + 1).padStart(2, '0')
            const dd = String(vnDate.getDate()).padStart(2, '0')
            const vnDateStr = `${yyyy}-${mm}-${dd}`
            console.log("    → Date sau bù giờ VN:", vnDateStr)
            map.set(vnDateStr, Number(item.revenue) || 0)
        }
    })

    const result = dateList.map(date => ({
        date,
        revenue: map.get(date) || 0
    }))

    console.log("📊 Dữ liệu cuối cùng sau fill:", result)
    return result
}
    // Load dữ liệu cơ bản
    useEffect(() => {
        const fetchBase = async () => {
            try {
                const [totalRes, todayRes, typeRes, topRes] = await Promise.all([
                    getTotalRevenue(),
                    getTodayRevenue(),
                    getRevenueByProductType(),
                    getTopSellingProducts(5)
                ])
                console.log("📦 Dữ liệu cơ bản:", { totalRes, todayRes, typeRes, topRes })
                setTotalRevenue(totalRes.data.totalRevenue || 0)
                setTodayRevenue(todayRes.data.revenue || 0)
                setTypeRevenue(typeRes.data || [])
                setTopProducts(topRes.data || [])
            } catch (err) {
                console.error("❌ Lỗi load dữ liệu cơ bản:", err)
            }
        }
        fetchBase()
    }, [])

    // Load doanh thu theo tháng
    useEffect(() => {
        const fetchMonth = async () => {
            try {
                const res = await getRevenueByMonth(year)
                console.log("📦 Doanh thu theo tháng:", res.data)
                const map = {}
                res.data.forEach(m => map[m.month] = m.revenue)
                const filled = Array.from({ length: 12 }, (_, i) => ({
                    month: `Tháng ${i + 1}`,
                    revenue: map[i + 1] || 0
                }))
                setMonthRevenue(filled)
            } catch (err) {
                console.error("❌ Lỗi load theo tháng:", err)
            }
        }
        fetchMonth()
    }, [year])

    // Load 7 ngày khi thay đổi ngày đích
    useEffect(() => {
        const fetch7Days = async () => {
            try {
                const dateList = generate7Days(endDate)
                const from = dateList[0]
                const to = dateList[6]
                console.log("🚀 Gọi API getRevenueByDay với from:", from, "to:", to)

                const res = await getRevenueByDay(from, to)
                console.log("📦 Response API getRevenueByDay:", res)

                const chartData = prepareChartData(res.data || [], dateList)

                setDayRevenue(chartData)
            } catch (err) {
                console.error("❌ Lỗi load 7 ngày:", err)
                const dateList = generate7Days(endDate)
                setDayRevenue(dateList.map(date => ({ date, revenue: 0 })))
            }
        }

        fetch7Days()
    }, [endDate])

    return (
            <div className="p-6 bg-gray-100 min-h-screen font-futura-regular">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BarChart3 /> Quản lý doanh thu
                </h1>

                {/* SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-5 rounded shadow">
                        <p className="text-gray-500">Tổng doanh thu</p>
                        <p className="text-2xl font-bold text-green-600">
                            {money(totalRevenue)} ₫
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded shadow">
                        <p className="text-gray-500">Doanh thu hôm nay</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {money(todayRevenue)} ₫
                        </p>
                    </div>
                </div>

                {/* DOANH THU 7 NGÀY */}
                <div className="bg-white p-5 rounded shadow mb-8">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <Calendar /> Doanh thu 7 ngày gần nhất
                    </h2>
                    <div className="flex gap-3 mb-6 items-center">
                        <label className="text-sm font-medium whitespace-nowrap">Chọn ngày cuối:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            max={new Date().toISOString().slice(0, 10)}
                        />
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={dayRevenue}>
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => {
                                    const [y, m, d] = value.split("-")
                                    return `${d}/${m}`
                                }}
                            />
                            <YAxis tickFormatter={(value) => money(value)} />
                            <Tooltip
                                formatter={(value) => `${money(value)} ₫`}
                                labelFormatter={(label) => {
                                    const [y, m, d] = label.split("-")
                                    return `Ngày ${d}/${m}/${y}`
                                }}
                            />
                            <Line
                                type="linear"
                                connectNulls={false}
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: "#3b82f6", r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Hiển thị doanh thu 7 ngày liên tiếp tính đến ngày bạn chọn (luôn đủ 7 ngày, ngày không có đơn = 0đ)
                    </p>
                </div>

                {/* Các phần còn lại giữ nguyên */}
                <div className="bg-white p-5 rounded shadow mb-8">
                    <h2 className="font-semibold mb-4">Doanh thu theo tháng</h2>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="border px-3 py-1 rounded w-32"
                            placeholder="Năm"
                        />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthRevenue}>
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(v) => money(v)} />
                            <Tooltip formatter={(v) => `${money(v)} ₫`} />
                            <Bar dataKey="revenue" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-5 rounded shadow mb-8">
                    <h2 className="font-semibold mb-4">Doanh thu theo loại</h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 text-left">Loại</th>
                                <th className="p-3 text-right">Đã bán</th>
                                <th className="p-3 text-right">Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {typeRevenue.map((t) => (
                                <tr key={t.typeId} className="border-t">
                                    <td className="p-3">{t.nameType}</td>
                                    <td className="p-3 text-right">{t.totalSold}</td>
                                    <td className="p-3 text-right">{money(t.revenue)} ₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp /> Top sản phẩm bán chạy
                    </h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 text-left">Sản phẩm</th>
                                <th className="p-3 text-right">Đã bán</th>
                                <th className="p-3 text-right">Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3 text-right">{p.totalSold}</td>
                                    <td className="p-3 text-right">{money(p.revenue)} ₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
    )
}

export default RevenueManagement