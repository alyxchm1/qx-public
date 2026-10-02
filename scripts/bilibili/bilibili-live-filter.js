/*
 * Bilibili Live Filter
 * Quantumult X - script-response-body
 *
 * Target:
 * api.live.bilibili.com/xlive/app-interface/v2/index/feed
 *
 * 删除：
 * 1. small_card_v1      普通直播间卡片
 * 2. area_entrance_v3   直播分区入口
 */

const DEBUG = false;

try {
    const obj = JSON.parse($response.body);

    if (!Array.isArray(obj?.data?.card_list)) {

        if (DEBUG) {
            console.log(
                "[Bilibili Live Filter] data.card_list not found"
            );
        }

        $done({
            body: $response.body
        });

    } else {

        const before = obj.data.card_list.length;

        obj.data.card_list =
            obj.data.card_list.filter(card => {

                const type = card?.card_type;

                // 普通直播间
                if (type === "small_card_v1") {
                    if (DEBUG) {
                        console.log(
                            "[Bilibili Live Filter] BLOCK | small_card_v1"
                        );
                    }

                    return false;
                }


                // 直播分区入口
                if (type === "area_entrance_v3") {
                    if (DEBUG) {
                        console.log(
                            "[Bilibili Live Filter] BLOCK | area_entrance_v3"
                        );
                    }

                    return false;
                }


                return true;
            });


        const after = obj.data.card_list.length;
        const removed = before - after;

        console.log(
            `[Bilibili Live Filter] ${before} -> ${after}, removed ${removed}`
        );


        $done({
            body: JSON.stringify(obj)
        });
    }

} catch (error) {

    console.log(
        `[Bilibili Live Filter] ERROR: ${error}`
    );

    // 出错时返回原始响应。
    $done({
        body: $response.body
    });
}