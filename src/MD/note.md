computed: {
    ...mapGettter(['test'])
}
...mapGetters 的原理:
const getters = {
    a: () => 1,
    b: () => 2,
    c: () => 3,
}
function fn(keys) {
    const data = {}
    keys.forEach(key => {
        if (getters.hasOwnProperty(key)) {
            data[key] = getters[key]
        }
    })
    return data
}
computed: {
    ...fn(['a', 'b', 'c'])
}
mounted: {
    如果从getters 找不到相应的a，b时会返回空
    console.log(this.a,this.b) 
}

