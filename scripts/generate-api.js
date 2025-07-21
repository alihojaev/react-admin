const fs = require('fs');
const path = require('path');

// Функция для определения типа параметра на основе схемы
function getParameterType(param) {
  if (param.schema) {
    const schema = param.schema;
    if (schema.type === 'string') {
      if (schema.format === 'uuid') return 'string';
      if (schema.format === 'date-time') return 'string';
      return 'string';
    }
    if (schema.type === 'integer') return 'number';
    if (schema.type === 'number') return 'number';
    if (schema.type === 'boolean') return 'boolean';
    if (schema.type === 'array') {
      const itemType = getParameterType({ schema: schema.items });
      return `${itemType}[]`;
    }
  }
  
  // Fallback типы на основе имени параметра
  const name = param.name.toLowerCase();
  if (name.includes('id')) return 'string';
  if (name.includes('email')) return 'string';
  if (name.includes('username')) return 'string';
  if (name.includes('apple')) return 'string';
  if (name.includes('google')) return 'string';
  if (name.includes('page')) return 'number';
  if (name.includes('size')) return 'number';
  if (name.includes('sort')) return 'string';
  
  return 'any';
}

// Функция для определения типа request body
function getRequestBodyType(requestBody) {
  if (!requestBody) return 'any';
  
  if (requestBody.content && requestBody.content['application/json']) {
    const schema = requestBody.content['application/json'].schema;
    if (schema && schema.$ref) {
      // Извлекаем имя типа из $ref
      const typeName = schema.$ref.split('/').pop();
      // Для простоты используем any, но можно добавить импорты типов
      return 'any';
    }
  }
  
  return 'any';
}

function genClass(className, cVar, extraCode, paths) {
  const classBody = Object.entries(
    paths.flatMap(e => {
      return Object.entries(e.value).map(rt => {
        return {
          path: e.path,
          tag: rt[1].tags[0],
          type: rt[0],
          value: rt[1],
          params: rt[1].parameters?.reduce((a, c) => {
            let cin = a[c.in];

            if (!cin) cin = a[c.in] = [];

            cin.push(c);

            return a;
          }, {}) || {}
        };
      });
    })
      .reduce((a, c) => {
        let v = a[c.tag];

        if (!v) v = a[c.tag] = [];

        v.push(c);

        return a;
      }, {})
  )
    .map(en => {
      const group = en[0].split('-')
        .filter(w => !['controller', 'rest'].includes(w))
        .map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))
        .join('');

      const methods = en[1]
        .map(r => {
          r.value.operationId = r.value.operationId.replace(/_\d+$/, '');

          return r;
        })
        .sort((a, b) => {
          if (a.value.operationId > b.value.operationId) return 1;
          if (a.value.operationId < b.value.operationId) return -1;
          return 0;
        })
        .map(r => {
          let params = '';
          let query = '';

          // Генерируем параметры с типами
          const paramList = [];

          if (r.params.path) {
            r.params.path.forEach(p => {
              const paramType = getParameterType(p);
              paramList.push(`${p.name}: ${paramType}`);
            });
          }

          if (r.params.query) {
            r.params.query
              .sort((a, b) => {
                if (a.default && !b.default) return 1;
                if (!a.default && b.default) return -1;
                if (a.name > b.name) return -1;
                if (a.name < b.name) return 1;
                return 0;
              })
              .forEach(p => {
                const paramType = getParameterType(p);
                if (p.name === 'pageable') {
                  paramList.push('page?: number', 'size?: number', 'sort?: string');
                } else {
                  const paramName = p.name + (p.default ? ` = ${p.default}` : '');
                  paramList.push(`${paramName}: ${paramType}`);
                }
              });
          }

          if (r.value.requestBody) {
            paramList.push(`body: any`);
          }

          params = paramList.join(', ');

          // Генерируем query строку
          if (r.params.query) {
            query += '?' + r.params.query
              .map(p => {
                const val = p.required || p.default ? p.name : `${p.name} ? ${p.name} : ''`;
                if (p.name === 'pageable') return "page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}";
                else return `${p.name}=\${${val}}`;
              })
              .join('&');
          }

          return '    ' + r.value.operationId + '(' + params + ') {\n' +
            `      return ${cVar}.` + r.type + '(`' +
            r.path.replaceAll(/\{/g, '${') +
            query +
            '`' +
            (r.value.requestBody ? ', body' : '') +
            ')' +
            '\n    }';
        }).join(',\n\n');

      return {
        group,
        methods
      };
    })
    .sort((a, b) => {
      const ag = a.group.toLowerCase();
      const bg = b.group.toLowerCase();
      if (ag > bg) return 1;
      if (ag < bg) return -1;
      return 0;
    })
    .map(g => {
      return '  ' + g.group + ' = {\n\n' + g.methods + '\n  }';
    })
    .join('\n\n');

  return `class ${className} {\n${extraCode ? '\n' + extraCode + '\n\n' : ''}${classBody}\n}`;
}

async function generateApi() {
  try {
    // URL вашего Swagger документа
    const swaggerUrl = process.env.SWAGGER_URL || 'http://localhost:8081/v3/api-docs';
    
    console.log(`Fetching Swagger documentation from: ${swaggerUrl}`);
    
    const response = await fetch(swaggerUrl);
    const r = await response.json();

    const paths = Object.entries(r.paths).map(e => {
      return {
        path: e[0],
        value: e[1]
      };
    })
      .reduce(
        (a, c) => {
          if (
            [
              '/api/public',
              '/api/verify/password',
              '/api/restore/password'
            ].filter(p => c.path.startsWith(p))
              .length
          ) {
            a.public.push(c);
          } else {
            a.auth.push(c);
          }
          return a;
        },
        { auth: [], public: [] }
      );

    let text = 'import { Http, PublicHttp } from "../http";\n\n' +
      'const c = new Http()\n' +
      'const pc = new PublicHttp()\n\n';

    text += 'export ' + genClass(
      'AuthApi',
      'c',
      '  get cli() {\n    return c\n  }',
      paths.auth
    ) + '\n\n';

    text += 'export ' + genClass('P_Api', 'pc', '', paths.public) + '\n';

    // Создаем директорию если её нет
    const outputDir = path.join(__dirname, '..', 'src', 'lib', 'generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'api.ts');
    
    return new Promise((res, rej) => {
      fs.writeFile(outputPath, text, err => {
        if (err) rej(err);
        else {
          console.log(`API generated successfully: ${outputPath}`);
          res('DONE!');
        }
      });
    });
  } catch (error) {
    console.error('Error generating API:', error);
    throw error;
  }
}

// Запускаем генерацию если скрипт вызван напрямую
if (require.main === module) {
  generateApi()
    .then(console.log)
    .catch(console.error);
}

module.exports = { generateApi }; 