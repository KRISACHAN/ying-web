import Colors from 'colors/safe';
import { isString } from 'lodash';

const THEMES = {
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
};

Colors.setTheme(THEMES);

const log = {};

Object.keys(THEMES).forEach(theme => {
    log[theme] = message => {
        return console.log(
            Colors[theme](
                isString(message) ? message : JSON.stringify(message),
            ),
        );
    };
});

export default log;
