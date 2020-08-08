jQuery(document).ready(function($) {
    var contactBucketName = 's3-form-data-tanaka-portfolio';
    var bucketRegion = 'ap-northeast-1';
    var IdentityPoolId = 'ap-northeast-1:be69bc3e-5fb7-4919-b184-26a13cad5a50';
 
    AWS.config.update({
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId
        })
    });
 
    var s3 = new AWS.S3({
        params: {Bucket: contactBucketName},
    });
 
    // hide messages 
    $("#error").hide();
    $("#success").hide();
 
    // on submit...
    $("#contactForm #submit").click(function() {
        $("#error").hide();
        
        //name
        var name = $("input#name").val();
        if(name == ""){
            $("#error").fadeIn().text("名前を入力してください。(Name required.)");
            $("input#name").focus();
            return false;
        }
        
        // email
        var email = $("input#email").val();
        if(email == ""){
            $("#error").fadeIn().text("メールアドレスを入力してください。(Email required.)");
            $("input#email").focus();
            return false;
        }
 
        var now = new Date();
        var obj = {"name":$("input#name").val(), "email":$("input#email").val() ,"comments":$("#comments").val(), "date": now.toLocaleString()};
        var blob = new Blob([JSON.stringify(obj, null, 2)], {type:'text/plain'});
        s3.putObject({Key: now.getTime() + ".txt", ContentType: "text/plain", Body: blob, ACL: "public-read"},
        function(err, data){
            if(err !== null){
                $("#error").fadeIn();
            }
            else{
                $("#success").fadeIn();
                $("#contactForm").fadeOut();
            }
        });
    });
 
    return false;
});