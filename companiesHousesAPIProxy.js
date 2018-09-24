const fetch = require('node-fetch');
var request = require('request');

class APIProxy {
    constructor(res, callback) {
        this.res = res;
        this.callback = callback;
    }
    fetchUrl(url){
        return this.buildAuthenticatedReq(url);
    }
    searchSingle(number, seekControlling = false) {
        let status = (!seekControlling) ? "Fetching company " + number : "Fetching parent company of " + number;
        var qry = (!seekControlling) ? "/company/" + number : "/company/" + number + "/persons-with-significant-control";
        var url = "https://api.companieshouse.gov.uk";// + trimmedTerm;
        var payload = { status: this.message, term: number };
        return this.buildAuthenticatedFetch(url + qry, number); //Failed to load https://api.companieshouse.gov.uk/search?q=AKZO+Nobel: Request header field access-control-allow-origin is not allowed by Access-Control-Allow-Headers in preflight response
    }
    search(term) {
        if (term) {
            term = term.trim();
            this.currentSearchTerm = term;
            this.dispatch(fetchCompany(term));
        }
        let tempTerm = Object.assign(term);
        if (tempTerm.includes('%')) {
            let temp = tempTerm.split('%');
            this.associated = temp[1].trim();
            tempTerm = temp[0];
        }
        let sp = new StringParser();

        var trimmedTerm = sp.prepareUrlParam(tempTerm);
        //
        //.join('+')
        var qry = "/search/companies?q=" + trimmedTerm;
        var url = "https://api.companieshouse.gov.uk";// + trimmedTerm;
        let test = true;
        if (!test) {
            try {
                this.buildAuthenticatedFetch(url + qry, term); //Failed to load https://api.companieshouse.gov.uk/search?q=AKZO+Nobel: Request header field access-control-allow-origin is not allowed by Access-Control-Allow-Headers in preflight response
            } catch (err) {
                console.log('bingo' + err);
            }
        }else{
            let utls = new MyUtilities();
            utils.callApiToProxy(url + qry).then()
        }
    }
    searchAnon(term) {
        if (term) {//new message type that disables the isCompanyValid check ?
            term = term.trim();
            //this.currentSearchTerm = term;
            //this.dispatch(fetchCompany(term));
        }
        let tempTerm = Object.assign(term);
        if (tempTerm.includes('%')) {
            let temp = tempTerm.split('%');
            this.associated = temp[1].trim();
            tempTerm = temp[0];
        }
        let sp = new StringParser();

        var trimmedTerm = sp.prepareUrlParam(tempTerm);
        //
        //.join('+')
        var qry = "/search/companies?q=" + trimmedTerm;
        var url = "https://api.companieshouse.gov.uk";// + trimmedTerm;
        try {
            this.buildAuthenticatedFetch(url + qry, term); //Failed to load https://api.companieshouse.gov.uk/search?q=AKZO+Nobel: Request header field access-control-allow-origin is not allowed by Access-Control-Allow-Headers in preflight response
        } catch (err) {
            console.log('bingo' + err);
        }
    }
    buildAuthenticatedReq(url, term) {
        var key = "0HNw-7ksM_UAogVOsC_b0wz3QC7apDX-IwLcitho";//this.getActiveKey();//"0HNw-7ksM_UAogVOsC_b0wz3QC7apDX-IwLcitho";//1gS8uBAORI_5A4ea6_k9zFlzSnvKo1syfMouWU6i (2)//0HNw-7ksM_UAogVOsC_b0wz3QC7apDX-IwLcitho (1)
        let b = new Buffer(key + ":").toString('base64');
        let authorization = "Basic " + b;
        var me = this;
       return request({
            uri: url,
            headers: {
                "Authorization": authorization,
            }
          }).pipe(this.res);
    }
    buildAuthenticatedFetch(url, term) {
        var key = "0HNw-7ksM_UAogVOsC_b0wz3QC7apDX-IwLcitho";//this.getActiveKey();//"0HNw-7ksM_UAogVOsC_b0wz3QC7apDX-IwLcitho";//1gS8uBAORI_5A4ea6_k9zFlzSnvKo1syfMouWU6i (2)//0HNw-7ksM_UAogVOsC_b0wz3QC7apDX-IwLcitho (1)
        let b = new Buffer(key + ":").toString('base64');
        let authorization = "Basic " + b;
        var me = this;
        return fetch(url, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: { 'Authorization': authorization }, //h
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        })
            .then(function (response) {
                if (!response.ok) {
                    console.log("loging " + term);
                }
                return response;
            }).then(response => response.json())
            .then(json => {
                me.callback(json);
            })
            .catch(function (err) {
                console.log("error: " + err);
                // let utils = new MyUtilities();
                // utils.logError(err);
                // if (err.message === "Failed to fetch") {
                //     me.triggerViewToDisplayWaitingPeriod(true);
                //     setTimeout(function () { me.search(me.currentSearchTerm); me.triggerViewToDisplayWaitingPeriod(false) }, 300000);
                //     //me.swapActiveKeys();
                //     //me.search(me.currentSearchTerm);
                // }
            });
    }
}
module.exports = APIProxy
