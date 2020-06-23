import * as vscode from "vscode";

const GET_OFF_MSG = "已经下班咯, Giao起来！";

function getTimesMsg(): string {
  const now = new Date();
  const toHomeTimes = new Date();
  toHomeTimes.setHours(
    vscode.workspace.getConfiguration().get("giao-giao-everyday.toHomeHours") ||
      0
  );
  toHomeTimes.setMinutes(
    vscode.workspace
      .getConfiguration()
      .get("giao-giao-everyday.toHomeMinutes") || 0
  );
  toHomeTimes.setSeconds(0);

  const duration = toHomeTimes.getTime() - now.getTime();

  if (duration <= 0) {
    return GET_OFF_MSG;
  }
  const hour = Math.floor(duration / 1000 / 60 / 60);
  const minute = Math.floor((duration / 1000 / 60) % 60);
  const second = Math.floor((duration / 1000) % 60);

  return `>> 距下班还有${hour ? hour + "时" : ""}${
    minute ? minute + "分" : ""
  }${second ? second + "秒" : ""}`;
}

// 插件被激活时触发，代码总入口；param：context 插件上下文
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "giao-giao-everyday" is now active!'
  );

  let giaoFunc = vscode.commands.registerCommand(
    "giao-giao-everyday.sayGiao",
    () => {
      let str = "一给我哩giaogiao！";
      const name = vscode.workspace
        .getConfiguration()
        .get("giao-giao-everyday.name");

      if (name) {
        str = str + name + ",开心工作，做个乖宝宝";
      }
      vscode.window.showInformationMessage(str);
      // vscode.window.setStatusBarMessage("Giao一下~");
    }
  );

  let toHome = vscode.commands.registerCommand(
    "giao-giao-everyday.toHome",
    () => {
      let isGetOff = false;

      vscode.window.setStatusBarMessage(getTimesMsg());
      const timer = setInterval(() => {
        let msg = getTimesMsg();
        vscode.window.setStatusBarMessage(msg);
        if (msg === GET_OFF_MSG) {
          if (!isGetOff) {
            vscode.window.showInformationMessage(msg);
            isGetOff = true;
            clearInterval(timer);
          }
        } else {
          isGetOff = false;
        }
      }, 1000);
    }
  );

  // // 获取所有命令
  // vscode.commands.getCommands().then((allCommands) => {
  //   console.log("所有命令：", allCommands);
  // });

  // 注册命令
  context.subscriptions.push(giaoFunc);
  context.subscriptions.push(toHome);
}

// 插件被释放时触发
export function deactivate() {}
