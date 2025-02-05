import { application, IDataSchema, Module, RequireJS } from '@ijstech/components';
import { IMediaPlayer } from './inteface';
const path = application.currentModuleDir;
const reqs = ['m3u8-parser'];

declare const window: any;

interface IModelOptions {
  updateWidget: () => Promise<void>;
  resize: () => void;
}

export class Model {
  private module: Module;
  private options: IModelOptions = {
    updateWidget: async () => { },
    resize: () => { }
  };
  private _data: IMediaPlayer = { url: '' };
  private _theme: string = 'light';
  private _parsedData: any = {};

  constructor(module: Module, options: IModelOptions) {
    this.module = module;
    this.options = options;
  }

  get url() {
    return this._data.url;
  }
  set url(value: string) {
    this._data.url = value;
  }

  get parsedData() {
    return this._parsedData;
  }

  getData() {
    return this._data;
  }

  async setData(value: IMediaPlayer) {
    this._data = value;
    await this.options.updateWidget();
  }

  getTag() {
    return this.module.tag;
  }

  async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.module.tag[prop] = newValue[prop];
      }
    }
    this.updateTheme();
    this.options.resize();
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.module.tag[type] = this.module.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.module.tag[type][prop] = value[prop];
    }
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.module.style.setProperty(name, value) :
      this.module.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this._theme || document.body.style.getPropertyValue('--theme');
    const tag = this.module.tag[themeVar] || {};
    this.updateStyle('--text-primary', tag.fontColor);
    this.updateStyle('--text-secondary', tag.secondaryColor);
    this.updateStyle('--background-main', tag.backgroundColor);
    this.updateStyle('--colors-primary-main', tag.primaryColor);
    this.updateStyle('--colors-primary-light', tag.primaryLightColor);
    this.updateStyle('--colors-primary-dark', tag.primaryDarkColor);
    this.updateStyle('--colors-secondary-light', tag.secondaryLight);
    this.updateStyle('--colors-secondary-main', tag.secondaryMain);
    this.updateStyle('--divider', tag.borderColor);
    this.updateStyle('--action-selected', tag.selected);
    this.updateStyle('--action-selected_background', tag.selectedBackground);
    this.updateStyle('--action-hover_background', tag.hoverBackground);
    this.updateStyle('--action-hover', tag.hover);
  }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          return this._getActions();
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Editor',
        target: 'Editor',
        getActions: () => {
          return this._getActions()
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this),
      }
    ]
  }

  private getPropertiesSchema() {
    const schema: IDataSchema = {
      type: "object",
      required: ["url"],
      properties: {
        url: {
          type: "string"
        }
      }
    };
    return schema;
  }

  private _getActions() {
    const propertiesSchema = this.getPropertiesSchema();
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData = { url: '' };
          return {
            execute: () => {
              oldData = { ...this._data };
              if (userInputData?.url) this._data.url = userInputData.url;
              this.options.updateWidget();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ...oldData };
              this.options.updateWidget();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: propertiesSchema as IDataSchema
      }
    ]
    return actions
  }

  private async loadLib() {
    if (window.m3u8Parser) return;
    const moduleDir = this.module['currentModuleDir'] || path;
    return new Promise((resolve, reject) => {
      RequireJS.config({
        baseUrl: `${moduleDir}/lib`,
        paths: {
          'm3u8-parser': 'm3u8-parser.min'
        }
      })
      RequireJS.require(reqs, function (m3u8Parser: any) {
        window.m3u8Parser = m3u8Parser;
        resolve(true);
      });
    })
  }

  async handleStreamData() {
    await this.loadLib();
    const parser = new window.m3u8Parser.Parser();
    parser.addParser({
      expression: /#EXTIMG/,
      customType: 'poster',
      dataParser: function (line: string) {
        return line.replace('#EXTIMG:', '').trim()
      },
      segment: true
    });
    const result = await fetch(this.url);
    const manifest = await result.text();

    parser.push(manifest);
    parser.end();
    this._parsedData = parser.manifest;
  }

  isEmptyObject(value: any) {
    if (!value) return true;
    return Object.keys(value).length === 0;
  }
}
