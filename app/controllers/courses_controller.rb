class CoursesController < ApplicationController
  before_action :set_course, only: [:show, :edit, :update, :destroy]
  before_action :authorize_admin, :initUser

  # GET /courses
  def index
    @edit_all_courses = Course.all
  end

  # GET /courses/new
  def new
    @edit_course = Course.new
  end

  # POST /courses
  def create
    @edit_course = Course.new(course_params)

    respond_to do |format|
      if @edit_course.save
        format.html { redirect_to @edit_course, notice: 'Course was successfully created.' }
        format.json { render :show, status: :created, location: @edit_course }
      else
        format.html { render :new }
        format.json { render json: @edit_course.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /courses/1
  # PATCH/PUT /courses/1.json
  def update
    respond_to do |format|
      if @edit_course.update(course_params)
        format.html { redirect_to @edit_course, notice: 'Course was successfully updated.' }
        format.json { render :show, status: :ok, location: @edit_course }
      else
        format.html { render :edit }
        format.json { render json: @edit_course.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /courses/1
  # DELETE /courses/1.json
  def destroy
    @edit_course.destroy
    respond_to do |format|
      format.html { redirect_to courses_url, notice: 'Course was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def show
  end

  def edit
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_course
      @edit_course = Course.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def course_params
      params.require(:course).permit(:name, :code)
    end
end
