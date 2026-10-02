/*
 * Bilibili Live Filter
 * Quantumult X
 *
 * Target:
 * api.live.bilibili.com/xlive/app-interface/v2/index/feed
 *
 * 删除直播 Feed 中:
 * 1. small_card_v1   普通直播间卡片
 * 2. area_entrance_v3 直播分区入口
 */

let body = $response.body;

try {
    const obj = JSON.parse(body);

    if (
        obj &&
        obj.data &&
        Array.isArray(obj.data.card_list)
    ) {
        const before = obj.data.card_list.length;

        obj.data.card_list = obj.data.card_list.filter(card => {
            const type = card && card.card_type;

            // 普通直播卡片
            if (type === "small_card_v1") {
                return false;
            }

            // 直播分区入口
            if (type === "area_entrance_v3") {
                return false;
            }

            return true;
        });

        const removed = before - obj.data.card_list.length;

        console.log(
            `[Bilibili Live Filter] ${before} -> ${obj.data.card_list.length}, removed ${removed}`
        );
    }

    $done({
        body: JSON.stringify(obj)
    });

} catch (error) {
    console.log(
        `[Bilibili Live Filter] JSON parse error: ${error}`
    );

    // 出错时返回原响应,避免把 B 站搞崩
    $done({
        body: body
    });
}