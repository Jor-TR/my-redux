class Store{
    constructor(reducer,initialState={}){

        // reducer必须是函数
        if(typeof reducer !=="function"){
            throw new Error("reducer is supposed to be a function");
        }
        this.reducer=reducer;
        this.oldState=null;
        this.state = initialState;

        // 防止外界直接对state进行改写
        Object.freeze(this.state);

        // 如果没有配置订阅函数，运行时将会报错
        this.onActionReceived=()=>{
            throw new Error("subscribed handler needed!");
        };
    }

    // 允许外部读取状态 
    getState(){
        return this.state;
    }

    // 向store发送action来生成新状态
    dispatch(action){
        const newState=this.reducer(this.state,action);
        this.oldState = this.state;
        this.state = newState;
        Object.freeze(this.state);

        // 每次收到action都执行订阅函数
        setTimeout(() => {
            this.onActionReceived(this.state, this.oldState);
        }, 0);
    }

    // 配置订阅函数
    subscribe(handler) {
        if(typeof handler!=="function"){
            throw new Error("handler is supposed to be a function");
        }
        this.onActionReceived= handler;
    }
}

export const createStore = (reducer, initialState) => new Store(reducer, initialState);
