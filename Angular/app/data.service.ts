import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    

  public domain_name = '127.0.0.1:8000';
  public domain_protocol = 'https://';
  public websocket = 'wss://';

  // API_domain_name = environment.API_domain_name;
  // API_domain_protocol = environment.API_domain_protocol;
  // API_websocket = environment.API_websocket;

  //public domain_name = environment.domain_name;
  //public domain_protocol = environment.domain_protocol;
  //public websocket = environment.websocket;

  
  public message;
  public goal_name;
  
  public login_username;
  public login_password;
  public login_project;
  
  public createuser_email;
  public createuser_password;
  public createuser_fullname;
  public createuser_usertype = "User";
  public createuser_projname;
  public add_slack: boolean = false;
  
  public inviteuser_email;
  public message_body;

  public username;
  public user_slack;
  public project_slack;
  public slack_username
  public slack_app_id;
  public realname;
  public role;
  public role_id;
  public project;
  public project_name;
  public project_id;
  public to_clear_board;
  public users;
  public proj_log;
  public work_IDs = [];
  public users_done = [];
  public users_TFT = [];
  // public users_id = [];
  public workID_goal_array;
  public sprints;
  public sprint_start;
  public sprint_end;
  selected_sprint: any;
  
  public sprint_goals;
  public _user_sprint_goals;
  public user_goal_history;
  public user_notes;
  public off_today: boolean = true;
  public user_workid;
  

  
  public httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  
  public authOptions;
  public imageAuthOptions;
  
  constructor(private http: HttpClient, private router: Router) { }
  
  createDemo()
  {
    this.message = "Creating the Demo, please wait...";
    this.http.get(this.domain_protocol + this.domain_name + '/scrum/create-demo/', this.httpOptions).subscribe(
        data => {
            this.login_username = data['username'];
            this.login_password = data['password'];
            this.login_project = data['project'];
            this.login();
        },
        err => {
            console.log(err);
        }
    );
  }

  sendEmail()
  {
    this.http.post(this.domain_protocol + this.domain_name + '/scrum/api/scrumemail/', JSON.stringify({'email': this.inviteuser_email, 'messagebody':this.message_body}), this.authOptions).subscribe(
        data => {
            this.message = 'Invitation Email has been sent'
            this.message_body = '';
            this.inviteuser_email = '';
        },
        err => {
            this.message = 'Email Not sent! Error!';
            console.error(err);
            this.message_body = '';
            this.inviteuser_email = '';
        }
    );
  }
  
 createUser()
  {
    console.log("inside DataService")
    console.log(this.add_slack)
    this.http.post(this.domain_protocol + this.domain_name + '/scrum/api/scrumusers/', JSON.stringify({'email': this.createuser_email, 'password': this.createuser_password, 'full_name': this.createuser_fullname, 'usertype': this.createuser_usertype, 'projname': this.createuser_projname}), this.httpOptions).subscribe(
        data => { 
          this.slack_app_id = data['client_id']
          if (this.createuser_usertype  == "Owner" && this.add_slack == true ) {
              console.log("======================= ADDING PROJECT TO SLACK=================================")
              console.log(this.createuser_usertype)
              // let element: HTMLElement = document.getElementById('slack_btn1') as HTMLElement;
              // element.click
              window.location.replace("https://slack.com/oauth/authorize?client_id=" + this.slack_app_id + "&state=main_chat_" + this.createuser_projname + ">>>" + this.createuser_email + "&scope=incoming-webhook,channels:read,channels:history,groups:history,mpim:history,emoji:read,files:read,groups:read,im:read,im:history,reactions:read,stars:read,users:read,team:read,chat:write:user,chat:write:bot,channels:write,bot")
              console.log("======================= After ADDING PROJECT TO SLACK=================================")
            }
            this.message = data['message'];
            this.createuser_email = '';
            this.createuser_password = '';
            this.createuser_fullname = '';
            this.createuser_usertype = '';
            this.createuser_projname = '';
            this.slack_app_id = data['client_id']
            
        },
        err => {
            this.message = 'User Creation Failed! Unexpected Error!';
            console.error(err);
            this.createuser_email = '';
            this.createuser_password = '';
            this.createuser_fullname = '';
            this.createuser_usertype = '';
            this.createuser_projname = '';
        }
    );
  }

  
  admin()
  {
    this.message = 'Welcome to the Admin Panel'
    this.router.navigate(['admin']);
  }

  profile()
  {
    this.message = 'Welcome'
    this.router.navigate(['profile']);
  }

  login()
  {
    this.http.post(this.domain_protocol + this.domain_name + '/scrum/api-token-auth/', JSON.stringify({'username': this.login_username, 'password': this.login_password, 'project': this.login_project}), this.httpOptions).subscribe(
        data => {
            sessionStorage.setItem('username', this.login_username);
            sessionStorage.setItem('realname', data['name']);
            sessionStorage.setItem('role', data['role']);
            sessionStorage.setItem('role_id', data['role_id']);
            sessionStorage.setItem('token', data['token']);
            sessionStorage.setItem('project_id', data['project_id']);
            sessionStorage.setItem('to_clear_board', data['to_clear_board']);
            sessionStorage.setItem('user_slack', data['user_slack']);
            sessionStorage.setItem('project_slack', data['project_slack']);
            sessionStorage.setItem('slack_username', data['slack_username']);
            sessionStorage.setItem('proj_log', data['proj_log']);
            this.username = this.login_username;
            this.role = data['role'];
            this.role_id = data['role_id'];
            this.realname = data['name'];
            this.project = data['project_id'];
            this.to_clear_board = data['to_clear_board'];
            console.log(this.to_clear_board)
            this.user_slack = data['user_slack'];
            this.project_slack = data['project_slack'];
            this.slack_username = data['slack_username'];
            console.log(data['slack_username'])
            this.message = 'Welcome!';
            this.router.navigate(['profile']);
            this.login_username = '';
            this.login_password = '';
            this.login_project = '';
            console.log(data);
            
            this.authOptions = {
                headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'JWT ' + data['token']})
            };
        },
        err => {
            if(err['status'] == 400)
                this.message = 'Login Failed: Invalid Credentials.';
            else
                this.message = 'Login Failed! Unexpected Error!';
            console.error(err);
            this.login_username = '';
            this.login_password = '';
            this.login_project = '';
        }
    );
  }

  
  addGoal(on_user)
  {
    this.http.post(this.domain_protocol + this.domain_name + '/scrum/api/scrumgoals/', JSON.stringify({'name': this.goal_name, 'user': on_user, 'project_id': this.project}), this.authOptions).subscribe(
        data => {
            console.log(data);
            this.users = data['data'];
            this.message = data['message'];
            this.goal_name = '';
            this.filterSprint(this.sprints);
        },
        err => {
            console.error(err);
            if(err['status'] == 401)
            {
                this.message = 'Session Invalid or Expired. Please Login.';
                this.logout();
            } else
            {
                this.message = 'Unexpected Error!';    
            }
            this.goal_name = '';
        }
    );  
  }

             
  filterSprint(uSprints) {
    this.sprints= uSprints
    var filter_goal = []
    console.log(filter_goal)
        // this.sprint_goals.length = 0 
          for (var i = 0;  i < this.users.length; i++)  {
            for (var j = 0;  j < this.users[i].scrumgoal_set.length; j++)  {
              if (this.sprints.length) {
                if (this.users[i].scrumgoal_set[j].time_created >= this.sprints[this.sprints.length - 1].created_on && 
                  this.users[i].scrumgoal_set[j].time_created <= this.sprints[this.sprints.length - 1].ends_on)
                  {                  
                  console.log(this.users[i].scrumgoal_set[j].time_created)
                  console.log(this.users[i].scrumgoal_set[j].name)
                   // this.users[i].scrumgoal_set[j].user_id = this.users[i].id
                   filter_goal.push(this.users[i].scrumgoal_set[j]);
                  }
              } else {
                  this.users[i].scrumgoal_set[j].user_id = this.users[i].id
                  filter_goal.push(this.users[i].scrumgoal_set[j]); 
              }
            }
          }
          console.log(filter_goal)
          this.sprint_goals = filter_goal

  }

  changeSprint() 
  {   
    this.sprint_goals = [];
      for (var i = 0;  i < this.users.length; i++)  {
        for (var j = 0;  j < this.users[i].scrumgoal_set.length; j++)  {
          if (this.users[i].scrumgoal_set[j].time_created > this.selected_sprint.created_on && 
            this.users[i].scrumgoal_set[j].time_created < this.selected_sprint.ends_on)
            {                
             this.users[i].scrumgoal_set[j].user_id = this.users[i].id;
             this.sprint_goals.push(this.users[i].scrumgoal_set[j]);
            }
          } 
        }
  }
  
  logout()
  {
    this.username = '';
    this.role = '';
    this.role_id = '';
    this.users = [];
    this.realname = '';
    this.project = 0;
    this.project_name = '';
    this.user_slack = '';
    this.project_slack = '';
    this.router.navigate(['home']);
    this.authOptions = {};
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('role_id');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('project_id');
    sessionStorage.removeItem('realname');
    sessionStorage.removeItem('user_slack');
    sessionStorage.removeItem('project_slack');
  }

  moveGoal(goal_id, to_id, hours, push_id)
  {
    console.log("~~~~~~~~~~~~~~~~~~~~~~parameters passed ~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log(goal_id)
    console.log(to_id)
    console.log(hours)
    console.log(push_id)
    this.http.patch(this.domain_protocol + this.domain_name + '/scrum/api/scrumgoals/', JSON.stringify({'goal_id': goal_id, 'to_id': to_id, 'hours': hours, 'project_id': this.project, 'push_id': push_id}), this.authOptions).subscribe(
        data => {
            this.users = data['data'];
            this.message = data['message'];
            this.filterSprint(this.sprints)
              if (this.selected_sprint) {
                  this.changeSprint()
                }
                else{
                  this.filterSprint(this.sprints)
                }
        },
        err => {
            console.error(err);
            
            if(err['status'] == 401)
            {
                this.message = 'Session Invalid or Expired. Please Login.';
                this.logout();
            } else
            {
                this.message = 'Unexpected Error!';    
            }
        }
    );  
  }
  
  changeOwner(from_id, to_id)
  {
    this.http.put(this.domain_protocol + this.domain_name + '/scrum/api/scrumgoals/', JSON.stringify({'mode': 0, 'goal_id': from_id, 'to_id': to_id, 'project_id': this.project}), this.authOptions).subscribe(
        data => {
            this.users = data['data'];
            this.message = data['message'];
            this.filterSprint(this.sprints)
        },
        err => {
            console.error(err);
            if(err['status'] == 401)
            {
                this.message = 'Session Invalid or Expired. Please Login.';
                this.logout();
            } else
            {
                this.message = 'Unexpected Error!';    
            }
        }
    );   
  }

  clearBoardSwitch()  {

    this.http.put(this.domain_protocol + this.domain_name + '/scrum/api/scrumgoals/', JSON.stringify({'mode': 3, 'project_id': this.project}), this.authOptions).subscribe(
        data => {
            console.log("toggle successful")
            this.message = data['message'];
            console.log(data['to_clear_board'] + 'true')
            sessionStorage.setItem('to_clear_board', data['to_clear_board']);
            this.to_clear_board  = data['to_clear_board']; 

        },
        err => {
          console.log('toggle failed')
            console.error(err);
            if(err['status'] == 401)
            {
                this.message = 'Session Invalid or Expired. Please Login.';
                this.logout();
            } else
            {
                this.message = 'Unexpected Error!';    
            }
        }
    );   
  }


}
