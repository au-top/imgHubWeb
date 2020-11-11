export function CreateShake(f:(...any:any)=>any,shakeTimeMs=1*1000){
    let topTime=0;
    return ()=>{
        const thisTime=Date.now();
        if(
            topTime+shakeTimeMs<=thisTime
        ){
            topTime=thisTime;
            return f();
        }
        return undefined;
    }
}