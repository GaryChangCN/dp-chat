import { v4 as uuidV4 } from 'uuid'

/** 生成 uuid */
export default function uuid(replaceSpliter = true) {
    const ret = uuidV4()

    if (!replaceSpliter) {
        return ret
    }

    return ret.replace(/-/g, '')
}
