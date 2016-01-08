var punctuationRE = /([.!\?,])/g;

module.exports = function (message){
	var first = message.split(" ")[0],
        command = first.toLowerCase().replace(punctuationRE, ""),
        parameters = "",
        parametersLocation = message.indexOf(" ");

    if (parametersLocation !== -1) parameters = message.slice(parametersLocation);

    return {
    	command: command,
    	parameters: parameters.trim()
    }
};