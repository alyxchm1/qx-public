/*
Bilibili 首页推荐流过滤

规则：
1. 删除直播       goto = "live"
2. 删除图文       goto = "picture"
3. 普通视频       goto = "av"
   仅保留 duration >= 15 分钟
*/

const MIN_DURATION = 15 * 60; // 15 min

try {
    const obj = JSON.parse($response.body);

    if (Array.isArray(obj?.data?.items)) {
        const before = obj.data.items.length;

        obj.data.items = obj.data.items.filter(item => {
            const goto = item?.goto;
            const duration = item?.player_args?.duration;

            // 1. 拒绝直播
            if (goto === "live") {
                return false;
            }

            // 2. 拒绝图文
            if (goto === "picture") {
                return false;
            }

            // 3. 普通视频：过滤 < 15 min
            if (goto === "av") {
                if (typeof duration !== "number") {
                    return false;
                }

                return duration >= MIN_DURATION;
            }

            // 未知类型暂时保留，避免误伤其他功能
            return true;
        });

        console.log(
            `[Bilibili] ${before} -> ${obj.data.items.length}, ` +
            `removed ${before - obj.data.items.length}`
        );
    }

    $done({
        body: JSON.stringify(obj)
    });

} catch (e) {
    console.log(`[Bilibili] filter error: ${e}`);
    $done({});
}
