class UsersController < ApplicationController
  before_action :set_edit_user, only: [:show, :edit, :update, :destroy]

  before_action :authorize_admin

  # GET /users
  # GET /users.json
  def index
    @edit_all_users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @edit_user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @edit_user = User.new(user_params)

    respond_to do |format|
      if @edit_user.save
        format.html { redirect_to @edit_user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @edit_user }
      else
        format.html { render :new }
        format.json { render json: @edit_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @edit_user.update(user_params)
        format.html { redirect_to @edit_user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @edit_user }
      else
        format.html { render :edit }
        format.json { render json: @edit_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @edit_user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_edit_user
      @edit_user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:matricNo, :password, :password_confirmation)
    end
end
