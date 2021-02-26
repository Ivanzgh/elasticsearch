class ReturnData {
  // 构造 函数 默认 returnCode 为1
  constructor(returnCode) {
    this.returnCode = returnCode ? returnCode : 1;
    switch (returnCode) {
      case -9:
        this.returnMsg = "系统异常！";
        break;
      case -2:
        this.returnMsg = "登陆超时，请重新登陆！";
        break;
      case -1:
        this.returnMsg = "操作失败！";
        break;
      case 1:
        this.returnMsg = "操作成功！";
    }
  }

  // 设置 成功
  setSuccess() {
    this.returnCode = 1;
    this.returnMsg = "操作成功！";
  }

  // 设置 失败
  setError() {
    this.returnCode = -1;
    this.returnMsg = "操作失败！";
  }

  // 登录超时
  setLoginTimeOut() {
    this.returnCode = -2;
    this.returnMsg = "登陆超时，请重新登陆！";
  }

  // 设置系统异常
  setSysException(excepMsg) {
    this.returnCode = -9;
    this.returnMsg = "系统异常：" + excepMsg;
  }

  // 设置返回值
  setReturnData(returnData) {
    this.returnData = returnData;
  }
}

module.exports = ReturnData;
