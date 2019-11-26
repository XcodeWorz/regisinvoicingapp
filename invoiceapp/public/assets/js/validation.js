/*********************** INCLUDE AFTER JQUERY FILE ***********************************/
/**
	* @author:PALASH
	* @Description: function to check for empty  
	* Create Date: 2-9-16
	*
	* Input: inputId value
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isNotEmpty(val)
	{
		if(val === "")
		{
			return false;
		}
		return true;
		
	}
/*  function to check for empty --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for integer  
	* Create Date: 2-9-16
	*
	* Input: inputId value
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isNumeric(val)
	{
		var reg = /^\d+$/;
		if( !reg.test( val ) )
		{
			return false;
		}
		return true;
	}
/*  function to check for empty --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for alphabetic
	* Create Date: 2-9-16
	*
	* Input: inputId value
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isAlphabetic(val)
	{
		var reg = /^[a-zA-Z]+$/;
		if( !reg.test( val ) )
		{
			return false;
		}
		return true;
	}
/*  function to check for alphabetic --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for alpha numeric
	* Create Date: 2-9-16
	*
	* Input: inputId value
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isAlphanumeric(val)
	{
		var reg = /^[0-9a-zA-Z]+$/;
		if( !reg.test( val ) )
		{
			return false;
		}
		return true;
	}
/*  function to check for alpha numeric --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for phone number
	* Create Date: 2-9-16
	*
	* Input: inputId value
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isPhone(val)
	{
		if(!isNumeric(val))
		{
			return false;
		}
		else
		{
			var len	=	val.length;
			var count_len	=	10;
			if(len == count_len)
			{
				return true;
			}
			else
			return false;
		}
		
	}
/*  function to check for phone number --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for email
	* Create Date: 2-9-16
	*
	* Input: inputId value
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isEmail(val)
	{
		var reg =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if( !reg.test( val ) )
		{
			return false;
		}
		return true;
	}
/*  function to check for email --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for selected for DROPDOWN
	* Create Date: 2-9-16
	*
	* Input: inputId value
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isSelected(val)
	{
		if(val === "")
		{
			return false;
		}
		return true;
	}
/*  function to check for selected for DROPDOWN --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for checked for RADIO & CHECKBOXES (val=>inputName)
	* Create Date: 2-9-16
	*
	* Input: inputName
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isCheckedByName(val)
	{
		var elms = document.getElementsByName(val);
		var isChecked = false;
		for (var i = 0; i < elms.length; ++i)
		{
			if (elms[i].checked)
			{
				  isChecked = true;
				  break;
			}
		}
		return isChecked;
	}
	
	function isCheckedById(val)
	{
		return $('#'+val).is(":checked");
	}
/*  function to check for checked for RADIO & CHECKBOXES --- ends --- */

/**
	* @author:PALASH
	* @Description: function to check for length
	* Create Date: 2-9-16
	*
	* Input: inputId value, minLength , maxLength
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function isLength(val, minLength , maxLength)
	{
		if(val >= minLength && val <= maxLength)
		{
			return true;
		}
		return false;
	}
/*  function to check for length --- ends --- */

/**
	* @author:PALASH
	* @Description: function to verify password
	* Create Date: 2-9-16
	*
	* Input: password1 , password2
	* Output: true or false
	*
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function verifyPassword( password1, password2 )
	{
		if(password1 != password2)
		{
			return false;
		}
		return true;
	}
/*  function to verify password --- ends --- */

/**
	* @author:PALASH
	* @Description: function to clear form (reset form)
	* Create Date: 2-9-16
	*
	* Input: formId
	* Output: 
	* 
	* Edited By:
	* Edited Date:
	*
	* TODO: 
	*/
	function clearForm( formId )
	{
		$('#'+formId)[0].reset();
	}
/*  function to clear form (reset form) --- ends --- */

	function isDecimal(val){
		var RE = /^-{0,1}\d*\.{0,1}\d+$/;
		return (RE.test(val));
	}
	
	/* function to check for combination of the password */
	
	function passwordCheck(password)
	{
		var special_flag=	false;
		var alphanum_flag=	false;
		
		// CHECK FOR atleast one SPECIAL CHARACTERS
		var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
		for(var i = 0; i < specialChars.length;i++)
		{
		  if(password.indexOf(specialChars[i]) != -1)
		  {
			special_flag =	false;
			break;
		   }
		   else
		   {
				special_flag = true;
		   }
		}
	   
	   // CHECK FOR atleast one NUMBER
		if (/\d/.test(password) && /[a-zA-Z]/.test(password))
		{
			  alphanum_flag	=	false;
		}
		else
		{
		   alphanum_flag	=	true;
		}
	  
		if(special_flag || alphanum_flag )
		{
			return false;
		}
		return true;
	}

