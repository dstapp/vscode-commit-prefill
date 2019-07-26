import * as vscode from 'vscode';

let commitStatusBarItem: vscode.StatusBarItem;
let commitPrefillText: string;
let intervalId: any;

export function activate(context: vscode.ExtensionContext) {
  const gitExt = vscode.extensions.getExtension('vscode.git');

  if (!gitExt) {
    throw new Error('Git extension not found');
  }

  const editCommitTemplateCommandId = 'commitPrefill.editText';

  context.subscriptions.push(
    vscode.commands.registerCommand(editCommitTemplateCommandId, async () => {
      const git = gitExt.exports.getAPI(1);
      const selectedRepository = git.repositories.find((repo: any) => repo.ui.selected);

      if (selectedRepository === null) {
        return;
      }

      commitPrefillText =
        (await vscode.window.showInputBox({
          value: 'TICKET-',
          placeHolder: 'TICKET-123'
        })) || '';


      commitStatusBarItem.text = commitPrefillText;
      selectedRepository.inputBox.value = `${commitPrefillText} `;

      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = setInterval(() => {
        if (selectedRepository.inputBox.value === '') {
          selectedRepository.inputBox.value = `${commitPrefillText} `;
        }
      }, 10000);
    })
  );

  commitStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  commitStatusBarItem.command = editCommitTemplateCommandId;
  commitStatusBarItem.text = 'TICKET-????';
  commitStatusBarItem.show();

  context.subscriptions.push(commitStatusBarItem);
}

export function deactivate() {}
